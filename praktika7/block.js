class Block {
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_RENDER: "flow:render",
        FLOW_CDU: "flow:component-did-update"
    }

    _element = null;
    _meta = null;

    /** JSDoc
     * @param {string} tagName
     * @param {Object} props
     *
     * @returns {void}
     */
    constructor(tagName = "div", props = {}) {
        console.log("Инициализация с tagName", tagName)
        console.log("Инициализация с props", props)
        const eventBus = new EventBus();
        this._meta = {
            tagName,
            props
        }
        this.eventBus = () => eventBus;
        this._registerEvents(eventBus);
        this.props = this._makePropsProxy(props);
        eventBus.emit(Block.EVENTS.INIT);
    }

    _registerEvents(eventBus) {
        eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this.componentDidUpdate.bind(this));
    }

    // ----------------------------------------Эмитится Block.EVENTS.INIT ----------------------------------------------
    _createDocumentElement(tagName) {
        return document.createElement(tagName);
    }

    _createResources() {
        console.log("В данный момет this._element", this._element)
        const { tagName } = this._meta;
        this._element = this._createDocumentElement(tagName);
        console.log("После пирсваивания элемента", this._element)
    }

    _init() {
        console.log("Сработал тригер", Block.EVENTS.INIT)
        this._createResources();
    }
    // -----------------------------------------------------------------------------------------------------------------

    // ----------------------------------------Эмитится Block.EVENTS.FLOW_CDU ------------------------------------------
    componentDidUpdate(oldProps, newProps) {
        console.log("Сработал тригер", Block.EVENTS.FLOW_CDU)
        console.log("Переданы старые props", oldProps)
        console.log("Переданы новые props", newProps)
        const response = oldProps.text !== newProps.text;
        if (response) {
            this.eventBus().emit(Block.EVENTS.FLOW_CDM);
        }
        return response;
    }
    // -----------------------------------------------------------------------------------------------------------------

    // ----------------------------------------Эмитится Block.EVENTS.FLOW_CDM ------------------------------------------

    dispatchComponentDidMount() {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    _componentDidMount() {
        console.log("Сработал тригер", Block.EVENTS.FLOW_CDM)
        this.componentDidMount();
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    componentDidMount(oldProps) {}
    // -----------------------------------------------------------------------------------------------------------------

    get element() {
        return this._element;
    }

    getContent() {
        return this.element;
    }

    // ----------------------------------------Эмитится Block.EVENTS.FLOW_RENDER ---------------------------------------
    _render() {
        console.log("Сработал тригер", Block.EVENTS.FLOW_RENDER)
        this._element.innerHTML = this.render();
        console.log("---------------------------------- Рендер выполнен ----------------------------------------------")
    }

    render() {}
    // -----------------------------------------------------------------------------------------------------------------


    _makePropsProxy(props) {
        console.log("Присваиваем прокси")
        const self = this;
        return new Proxy(props, {
            get(target, prop) {
                const value = target[prop];
                console.log("Вызывается геттер прокси", value)
                return typeof value === 'function' ? value.bind(target) : value;
            },
            set(target, prop, value) {
                const oldProps = { ...self.props };
                target[prop] = value;
                self.componentDidUpdate(oldProps, target)
                //self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, target);
                return true;
            },
            deleteProperty(target, prop) {
                throw new Error("нет доступа");
                return false;
            },
        });
    }

    show() {
        this.element.style.display = "block";
    }

    hide() {
        this.element.style.display = "none";
    }

}