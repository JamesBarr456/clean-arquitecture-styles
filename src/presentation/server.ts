import express, { Router }  from 'express'
interface Options {
    port: number;
    routes: Router;
    public_path?: string;
}
export class Server {

    public readonly app = express();
    private serverListener?: any;
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: Options){
        const {port, routes, public_path = 'public'} = options
        this.port = port;
        this.routes = routes;
        this.publicPath = public_path
    }

    async start() {
        //* Middlewares
        this.app.use( express.json())
        this.app.use( express.urlencoded({extended: true}))
        //* Public Folders
        this.app.use(express.static(this.publicPath))
        //* Routes
        this.app.use( this.routes)
        //* SPA

        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running on port ${ this.port }`);
          });
    
  
    }
     close() {
        this.serverListener?.close();
      }
}