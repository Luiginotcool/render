export class Files {
    static fs: any;
    static init() {
    }

    static readFile(path: string): string {
        let fd = ""
        this.fs.readFile(path, "utf8", (err: any, data: any) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }
            fd = data;
        })
        return fd;
    }
}