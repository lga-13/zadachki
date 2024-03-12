class Button extends Block {
    constructor(props) {
        super("button", props);
    }

    setProps = nextProps => {
        console.log("----------------ВЫЗОВ СЕТ ПРОПС------------")
        console.log("Вызван метод setProps c nextProps=", nextProps)
        if (!nextProps) {
            console.log("nextProps пустые")
            console.log("----------------------------1")
            return;
        }
        console.log("Метод setProps устанавливает пропсы ибо они не пустые", nextProps)
        Object.assign(this.props, nextProps); // Now update the props
        console.log("----------------------------1")
    }
    componentDidMount() {}


    render() {
        console.log("Вызван переопределенный метод render")
        return `<div>${this.props.text}</div>`
    }
}

function render(query, block) {
    const root = document.querySelector(query);
    root.appendChild(block.getContent())
    block.dispatchComponentDidMount();
    return root;
}

const button = new Button({
    text: 'Click me',
});

// app — это class дива в корне DOM
render(".app", button);
console.log("ВЫЗВАНО ОБНОВЛЕНИЕ ПРОПСОВ")
// Через секунду контент изменится сам, достаточно обновить пропсы
setTimeout(() => {
    button.setProps({
        text: 'Click me, please',
    });
}, 1000);