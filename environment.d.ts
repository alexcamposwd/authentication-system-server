declare namespace NodeJS {
    export interface ProcessEnv {
        PORT?: String;
        NODE_ENV: 'development' | 'production';
        DB_URI: String;
    }
}
