(function () {

    class Tooltip {
        constructor() {
            this.el = document.createElement('div');
            this.el.style.position = 'absolute';

            this.el.classList.add(this.name);
            document.body.appendChild(this.el);

            this.onHide = this.onHide.bind(this);
        }

        get name() {
            return 'tooltip';
        }

        get indent() {
            return 5;
        }

        listeners = [];

        delegate(eventName, element, cssSelector, callback) {
            if (element) {
                const fn = event => {
                    if (!event.target.matches(cssSelector)) {
                        return;
                    }
                    callback(event);
                };

                element.addEventListener(eventName, fn);
                this.listeners.push({ fn, element, eventName });
            } else {
                console.error('Element не найден')
            }

            return this;
        }

// Реализация метода removeListeners
        removeListeners() {
            this.listeners.forEach(({fn, element, eventName}) => {
                element.removeEventListener(eventName, fn);
            });
            this.listeners = [];
        }

        onShow = (event) => {
            const tooltipText = event.target.getAttribute('data-tooltip');
            if (tooltipText) {
                if (this.el) {
                    this.el.innerHTML = tooltipText;
                    this.el.classList.add('tooltip_active');

                    const rect = event.target.getBoundingClientRect();
                    const left = rect.left + window.scrollX;
                    const top = rect.top + window.scrollY + this.indent;

                    this.el.style.left = `${left}px`;
                    this.el.style.top = `${top}px`;
                } else {
                    console.error("Element this.el не найден");
                }
            }
        }

        onHide() {
            if (this.el) {
                this.el.classList.remove('tooltip_active');
            } else {
                console.error("Element this.el не найден");
            }
        }

        attach(root) {
            this
                .delegate('mouseover', root, '[data-tooltip]', this.onShow)
                .delegate('mouseout', root, '[data-tooltip]', this.onHide);
        }

        detach() {
            this.removeListeners();
        }
    }

    window.Tooltip = Tooltip;
})();

const tooltip = new Tooltip();
tooltip.attach(document.body);