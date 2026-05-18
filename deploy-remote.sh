#!/bin/bash
# ============================================
# 远程服务器部署脚本（Docker Nginx 版）
# 由 Jenkins 通过 SSH 远程调用执行
# 前提：nginx 运行在 Docker 容器中，静态文件目录已挂载到宿主机
# ============================================

# ---------- 配置区（根据实际环境修改）----------
# 宿主机上的部署目录（已挂载到 Docker nginx 容器的 /usr/share/nginx/html）
REMOTE_PATH="/data/nginx/html/3d"
# 备份目录
BACKUP_PATH="/data/nginx/html/backup"
# Docker nginx 容器名称
NGINX_CONTAINER="my-nginx"
# 保留最近几份备份
KEEP_BACKUPS=5

PACKAGE_NAME="$1"



# --------------------------------------------
# 1. 解压上传的构建包
# --------------------------------------------
echo "正在解压构建包: /tmp/jenkins/html/${PACKAGE_NAME}"
cd /tmp/jenkins/html/
tar -xzf "${PACKAGE_NAME}"

if [ ! -d "/tmp/jenkins/html/dist" ]; then
    echo "错误: 解压失败，dist 目录不存在"
    exit 1
fi

# --------------------------------------------
# 2. 备份旧版本
# --------------------------------------------
echo "正在备份旧版本..."
mkdir -p "${BACKUP_PATH}"

if [ -d "${REMOTE_PATH}" ]; then
    cp -r "${REMOTE_PATH}" "${BACKUP_PATH}/3d-$(date +%Y%m%d-%H%M%S)"
fi

# --------------------------------------------
# 3. 替换部署目录
# --------------------------------------------
echo "正在替换部署文件..."
rm -rf "${REMOTE_PATH}"
mv /tmp/jenkins/html/dist "${REMOTE_PATH}"

# --------------------------------------------
# 4. 设置文件权限
#    Docker 容器内 nginx 通常以 nginx 用户运行（UID 101）
#    宿主机上的文件只需保证其他用户可读即可（755）
# --------------------------------------------
echo "正在设置文件权限..."
chmod -R 755 "${REMOTE_PATH}"

# --------------------------------------------
# 5. 重载 Nginx（通过 docker exec 进入容器执行）
# --------------------------------------------
echo "正在检查 Nginx 配置..."
docker exec "${NGINX_CONTAINER}" nginx -t

if [ $? -ne 0 ]; then
    echo "错误: Nginx 配置检查失败，正在回滚..."
    # 回滚：删除当前文件，恢复最近一次备份
    rm -rf "${REMOTE_PATH}"
    LATEST_BACKUP=$(ls -t "${BACKUP_PATH}" | head -1)
    if [ -n "${LATEST_BACKUP}" ]; then
        cp -r "${BACKUP_PATH}/${LATEST_BACKUP}" "${REMOTE_PATH}"
        echo "已回滚到备份: ${LATEST_BACKUP}"
    fi
    exit 1
fi

echo "正在重载 Nginx..."
docker exec "${NGINX_CONTAINER}" nginx -s reload

if [ $? -eq 0 ]; then
    echo "Nginx 重载成功"
else
    echo "错误: Nginx 重载失败"
    exit 1
fi

# --------------------------------------------
# 6. 清理临时文件和旧备份
# --------------------------------------------
echo "正在清理..."
rm -f "/tmp/jenkins/html/${PACKAGE_NAME}"

# 只保留最近 KEEP_BACKUPS 份备份
cd "${BACKUP_PATH}" 2>/dev/null && ls -t | tail -n +$((KEEP_BACKUPS + 1)) | xargs -r rm -rf

echo "部署完成！"
