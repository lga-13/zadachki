type Nullable<T> = T | null;

const text: Nullable<HTMLDivElement> = document.getElementById(
    "text"
) as HTMLDivElement;
const input: Nullable<HTMLInputElement> = document.getElementById(
    "input"
) as HTMLInputElement;

if (!text || !input) {
    throw new Error("нет полей");
}

const data = {
    title: ""
};

Object.defineProperty(data, 'title', {
    get() {
        return this._title;
    },
    set(value) {
        this._title = value;
        text.textContent = value;
    },
});

input.addEventListener("keyup", (event) => {
    data.title = (event.target as HTMLInputElement).value;
});
export default Nullable