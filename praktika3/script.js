const btn = document.querySelector('.button');

const result = [];
btn.addEventListener("click", function() {
    result.push('first event');
});
btn.addEventListener("click", () => {
    result.push('second event');
});

btn.click();
// Как сейчас: result -> ["second event"]
// Как должно быть: result -> ["first event", "second event"]