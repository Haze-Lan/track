import { environment } from "src/environments/environment";
import { CMD, CMDType } from "./common";

export class Socket {
    client!: WebSocket
    //连接服务器
    public connect(address: string, number: string, time:string ,callback: () => void | undefined): void {
        this.client = new WebSocket(environment.server)
        let data: CMD = {
            mode: CMDType.Login,
            data: {
                address: address,
                number: number,
                timing:time,
            }
        }
        this.client.onopen = () => {
            this.sendCMD(data);
            if (callback) {
                callback()
            }
        }

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



