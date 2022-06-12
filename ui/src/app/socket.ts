import { environment } from "src/environments/environment";
import { CMD, CMDType } from "./common";

export class Socket {
    client!: WebSocket

    constructor(openCallback: () => void, closeCallback: () => void) {
        this.client = new WebSocket(environment.server)
        this.client.onopen = () => {

            if (openCallback) {
                openCallback()
            }
        }
        this.client.close = () => {

            if (closeCallback) {
                closeCallback()
            }
        }
    }
    //连接服务器
    public connect(address: string, number: string, time: string): void {

        let data: CMD = {
            mode: CMDType.Login,
            data: JSON.stringify({
                address: address,
                number: number,
                timing: time,
            })
        }
        this.sendCMD(data);
    }
    //断开连接
    public disconnect(): void {
        if (this.client) {
            this.client.close()
        }
    }
    //发送指令
    public sendCMD(cmd: CMD) {
        this.client.send(JSON.stringify(cmd))
    }
    //接收服务器返回
    public receive(callback: Function): void {

    }
}



