

function SwitchButton(wrapper) {
    if (typeof wrapper == 'string')   {
        this._wrapper = document.getElementById(wrapper);
        this._wrapperId = wrapper;
    } else {
        this._wrapper = wrapper;
        this._wrapperId = wrapper.getAttribute('id');
    }

    if (!this._wrapper) throw "SwitchButton init: wrapping element not found";

    this._button = document.createElement('input');
    this._button.setAttribute('type', 'button');
    this._wrapper.appendChild(this._button);
    this._button.onclick = () => this.switchValue();

    var optionsAttr = this._wrapper.getAttribute('data-options');
    this._options = !!optionsAttr ? optionsAttr.split(';') : [];

    var defaultValue = this._wrapper.getAttribute('data-default-value');
    var defaultValueIsOk = !!defaultValue && this._options.includes(defaultValue);

    if (!!this._wrapperId)
        var valueFromStorage = window.localStorage.getItem(this._wrapperId+'_SwitchButton');
    var valueFromStorageIsOk = !!valueFromStorage && this._options.includes(valueFromStorage);

    if (valueFromStorageIsOk) this._value = valueFromStorage;
    else if (defaultValueIsOk) this._value = defaultValue;
    else if (this._options.length > 0) this._value = this._options[0];
    else this._value = 'None';

    this._valueIndex = this._options.indexOf(this._value);
    this._switchable = this._valueIndex != -1;

    this._button.value = this._value;
}
SwitchButton.prototype.getValue = function() { return this._value; };
SwitchButton.prototype.setValue = function(newValue) {
    if (!this._options.includes(newValue)) throw "Illegal value for SwitchButton";
    this._valueIndex = this._options.indexOf(newValue);
    this._value = newValue;
    this._button.value = newValue;
    if (!!this._wrapperId) {
        window.localStorage.setItem(this._wrapperId+'_SwitchButton', this._value);
    }
};
SwitchButton.prototype.getDiv = function () { return this._wrapper; };
SwitchButton.prototype.switchValue = function () {
    if (!this._switchable) return;
    var nextIndex = (this._valueIndex + 1) % this._options.length;
    this.setValue(this._options[nextIndex]);
};
SwitchButton.createButtons = function () {
    var divs = document.querySelectorAll('div[data-widget="SwitchButton"]');
    if (divs.length == 0) return;
    divs.forEach(div => new SwitchButton(div));
};



