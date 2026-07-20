import {LLMock} from "@copilotkit/aimock";


const mock = new LLMock({port: 0});


// 设置当用户发送 "hello" 时，模拟器回复 "Hi there!"
mock.onMessage("hello", { content: "Hi there!" }); 
await mock.start();
console.log("模拟器已启动，",mock.url);
 