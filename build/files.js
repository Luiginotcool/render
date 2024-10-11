export class Files {
    static init() {
    }
    static readFile(path) {
        let fd = "";
        this.fs.readFile(path, "utf8", (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }
            fd = data;
        });
        return fd;
    }
}
