pipeline {
    agent any

    // ==================== 环境变量 ====================
    environment {
        // 远程服务器信息（建议在 Jenkins 凭据管理中配置，此处仅为占位）
        REMOTE_HOST = '127.0.0.1'     // 远程服务器地址
        REMOTE_USER = ''                          // 远程服务器用户名
        REMOTE_PWD = ''                          // 远程服务器用户名
        REMOTE_PORT = '22'                            // SSH 端口
        // Nginx 部署目录 —— 这是宿主机上的目录，已挂载到 Docker nginx 容器中
        // 例如：docker run -v /data/nginx/html:/usr/share/nginx/html nginx
        REMOTE_PATH = '/data/nginx/html/3d'
        // Docker 中的 nginx 容器名称
        NGINX_CONTAINER = 'nginx'
        // Node.js 版本
        NODE_VERSION = '18'

    }

    // ==================== 构建参数 ====================
    parameters {
        // 分支选择
        string(name: 'BRANCH', defaultValue: 'master', description: '要构建的分支')
        // 是否清理 node_modules 后重新安装
        booleanParam(name: 'CLEAN_INSTALL', defaultValue: false, description: '是否清理 node_modules 重新安装依赖')
    }

    stages {


        stage('使用用户名密码') {
            steps {
                // 绑定凭证：将 ID 为 'my-credentials-id' 的凭证映射到变量 USERNAME 和 PASSWORD
                withCredentials([usernamePassword(
                    credentialsId: 'baiduyun', 
                    usernameVariable: 'USERNAME', 
                    passwordVariable: 'PASSWORD'
                )]) {
                    
                    // 直接在 Groovy 脚本中使用 (双引号，但注意打印风险)
                    script {
                        echo "用户名是: ${USERNAME}"
                          bat 'echo 密码是: %PASS%'
                        // 注意: 直接 echo 密码有安全风险，仅为演示语法
                        // echo "密码是: ${PASSWORD}" 
                    }
                }
            }
        }

        // ==================== 阶段1：拉取代码 ====================
        stage('拉取代码') {
            steps {
                script {
                    echo "正在拉取分支: ${params.BRANCH}"
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "*/${params.BRANCH}"]],
                        extensions: [[$class: 'CleanBeforeCheckout']],
                        userRemoteConfigs: [[
                            url: env.GIT_URL ?: scm.userRemoteConfigs[0].url,
                            credentialsId: env.GIT_CREDENTIALS_ID ?: ''
                        ]]
                    ])
                }
                echo '代码拉取完成'
            }
        }

        // ==================== 阶段2：安装依赖 ====================
        stage('安装依赖') {
            steps {
                script {
                    // 根据参数决定是否清理 node_modules
                    if (params.CLEAN_INSTALL) {
                        echo '清理 node_modules，执行全新安装...'
                        bat 'rmdir /s /q node_modules 2>nul & del package-lock.json 2>nul'
                    }
                    echo '正在安装项目依赖...'
                    bat 'npm install --registry=https://registry.npmmirror.com'
                    echo '依赖安装完成'
                }
            }
        }

        // ==================== 阶段3：代码检查（可选） ====================
        stage('TypeScript 类型检查') {
            steps {
                echo '正在进行 TypeScript 类型检查...'
                // vue-tsc -b 既做类型检查也生成构建缓存，build 命令中已包含
                bat 'npx vue-tsc -b --noEmit'
                echo '类型检查通过'
            }
        }

        // ==================== 阶段4：构建项目 ====================
        stage('构建项目') {
            steps {
                echo '正在构建生产环境代码...'
                // 使用 production 模式构建，自动加载 .env.production
                bat 'npm run build'
                echo '构建完成，产物位于 dist/ 目录'
            }
        }

        // ==================== 阶段5：打包产物 ====================
        stage('打包产物') {
            steps {
                script {
                    echo '正在将构建产物打包为 tar.gz...'
                    // 生成带时间戳的包名，便于回滚
                    def buildTime = new Date().format('yyyyMMdd-HHmmss')
                    def packageName = "dist-${buildTime}.tar.gz"
                    env.PACKAGE_NAME = packageName

                    // Windows 上使用 tar 命令打包（Windows 10+ 自带）
                    bat "tar -czf ${packageName} dist/"
                    echo "打包完成: ${packageName}"

                    // 归档构建产物，方便后续下载
                    archiveArtifacts artifacts: packageName, fingerprint: true
                }
            }
        }

        // ==================== 阶段6：部署到远程服务器 ====================
        stage('部署到远程服务器') {
            steps {
                script {
                    echo "即将部署到服务器: ${REMOTE_HOST}"

                    // 使用 SSH 方式上传 tar.gz 包到服务器临时目录
                    // 注意：需要在 Jenkins 中安装 Credentials Binding 和 SSH Agent 插件
                    withCredentials([
                        string(credentialsId: 'remote-server-ip', variable: 'DEPLOY_HOST'),
                        string(credentialsId: 'remote-server-user', variable: 'DEPLOY_USER'),
                    ]) {
                        // 步骤1：上传压缩包到服务器 /tmp 目录
                        echo '正在上传构建产物到服务器...'
                        bat """
                            "C:\\Program Files\\OpenSSH\\scp.exe" -P ${REMOTE_PORT} -o StrictHostKeyChecking=no ${PACKAGE_NAME} ${DEPLOY_USER}@${DEPLOY_HOST}:/tmp/${PACKAGE_NAME}
                        """

                        // 步骤2：在远程服务器上解压并替换 Nginx 目录
                        echo '正在远程执行部署脚本...'
                        bat """
                            "C:\\Program Files\\OpenSSH\\ssh.exe" -p ${REMOTE_PORT} -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} "bash -s" ${PACKAGE_NAME} < deploy-remote.sh
                        """
                    }

                    echo '部署完成'
                }
            }
        }

        // ==================== 阶段7：验证部署结果 ====================
        stage('验证部署') {
            steps {
                script {
                    echo '正在验证部署结果...'
                    // 等待 nginx reload 生效
                    sleep(time: 3, unit: 'SECONDS')

                    // 检查首页是否可访问（需要服务器开放对应端口）
                    def httpCode = bat(
                        script: "curl -o nul -s -w \"%{http_code}\" http://${REMOTE_HOST}/3d/",
                        returnStdout: true
                    ).trim()
                    if (httpCode == '200' || httpCode == '301' || httpCode == '302') {
                        echo "部署验证成功！HTTP 状态码: ${httpCode}"
                    } else {
                        error "部署验证失败！HTTP 状态码: ${httpCode}，请检查服务器配置"
                    }
                }
            }
        }
    }

    // ==================== 构建后操作 ====================
    post {
        // 构建成功
        success {
            script {
                echo '========================================'
                echo '构建部署成功！'
                echo "访问地址: http://${REMOTE_HOST}/3d/"
                echo '========================================'
            }
        }
        // 构建失败
        failure {
            script {
                echo '========================================'
                echo '构建部署失败，请检查日志排查问题'
                echo '========================================'
            }
        }
        // 无论成功失败都执行
        always {
            // 清理工作空间，释放磁盘空间
            cleanWs(
                cleanWhenNotBuilt: false,
                deleteDirs: true,
                disableDeferredWipeout: true
            )
        }
    }
}
