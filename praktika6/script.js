class ProxyProps {
    constructor(target) {
        return new Proxy(target, {
            get: function (obj, prop) {
                if (prop.startsWith('_')) {
                    throw new Error('Нет прав');
                } else {
                    const value = obj[prop];
                    return typeof value === 'function' ? value.bind(obj) : value;
                }
            },
            set: function (obj, prop, value) {
                if (prop.startsWith('_')) {
                    throw new Error('Нет прав');
                } else {
                    obj[prop] = value;
                    return true;
                }
            },
            deleteProperty: function (obj, prop) {
                if (prop.startsWith('_')) {
                    throw new Error('Нет прав');
                } else {
                    delete obj[prop];
                    return true;
                }
            }
        });
    }
}

// Объект с которым будем работать.
const props = {
    name: 'Abby',
    chat: 'the last of us. Part II',
    getChat() {
        this._privateMethod();
    },
    _privateMethod() {
        console.log(this._privateProp);
    },
    __privateMethodToo() {},
    _privateProp: 'Нельзя получить просто так',
};

// Инициализация прокси объекта
const proxyProps = new ProxyProps(props);

// Проверка получения чатов
proxyProps.getChat();
delete proxyProps.chat;

// Проверка установки новго значения
proxyProps.newProp = 2;
console.log(proxyProps.newProp);

// Попытка записи в приватный атрибут
try {
    proxyProps._newPrivateProp = 'Super game';
} catch (error) {
    console.log(error.message);
}

// Попытка удаления приватного атрибута
try {
    delete proxyProps._privateProp;
} catch (error) {
    console.log(error.message); // Error: Нет прав
}
