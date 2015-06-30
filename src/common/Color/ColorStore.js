var Colors = require('material-ui/lib/styles/colors');

var ColorStore = {
  syncanoThemeColorName: 'blue',

  getColorPickerPalette: function() {
    var colors = [],
        uniqueColors = Object.keys(Colors).filter(function(key) {
          return key.slice(-3) === '500';
        });

    uniqueColors.map(function(color) {
      color = color.slice(0, -3);
      if (color !== ColorStore.syncanoThemeColorName) {
        colors.push(color);
      }
    });

    return colors;
  },

  getColorByName: function(name, variation) {
    if (variation === 'dark') {
      return Colors[name + '700'];
    }
    if (variation === 'light') {
      return Colors[name + '100'];
    }
    return Colors[name + '500'];
  },

  getRandomColorName: function() {
    var uniqueColors      = this.getColorPickerPalette(),
        uniqueColorsCount = uniqueColors.length,
        randomNumber      = Math.floor((Math.random() * uniqueColorsCount));

    return uniqueColors[randomNumber];
  },

  getAllColors: function() {
    return this.getColorPickerPalette();
  }

};

module.exports = ColorStore;
