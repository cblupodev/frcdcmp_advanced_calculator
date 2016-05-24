// '{0}{1}'.lp_format('asdf', 1 + 2);
if (!String.prototype.format) {
    String.prototype.lp_format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

function l(message) {
    console.log(message);
}


function Keypress(which, alt, ctrl, metakey, shift) {
    this.which = which;
    this.alt = alt;
    this.ctrl = ctrl;
    this.metakey = metakey;
    this.shift = shift;

    // return true if two keys have the same combined press
    // return false if two keys don't have the same press
    this.compare = function(otherkey) {
        if (!otherkey) return false; // return false if undefined
        if (this.which !== otherkey.which) return false;
        if (this.alt !== otherkey.alt) return false;
        if (this.ctrl !== otherkey.ctrl) return false;
        if (this.metakey !== otherkey.metakey) return false;
        if (this.shift !== otherkey.shift) return false;
        return true;
    }

    this.print = function() {
        console.log(this);
    }
}

var app = angular.module('myApp', []);
app.controller('MainController', ['$scope', function($scope) {
    $scope.windowVar = '0';
    $scope.latestOperator = "";
    $scope.consumedOperator = false;
    $scope.operand1;
    $scope.operand2;

    $scope.oldkeypress;

    function action(sym) {
        if (!isNaN(sym) || sym === '.') { // if you clicked a number or the period
            if (!$scope.consumedOperator) {
                $scope.operand1 = $scope.operand1 === undefined ? '' : $scope.operand1;
                $scope.operand1 += sym;
                $scope.windowVar = $scope.operand1;
            }
            else {
                $scope.operand2 = $scope.operand2 === undefined ? '' : $scope.operand2;
                $scope.operand2 += sym;
                $scope.windowVar = $scope.operand2;

                $scope.operand1 = Number($scope.operand1); // convert to number
                $scope.operand2 = Number($scope.operand2); // convert to number
                var result;
                switch ($scope.latestOperator) {
                    case '/':
                        result = $scope.operand1 / $scope.operand2;
                        break;
                    case 'x':
                        result = $scope.operand1 * $scope.operand2;
                        break;
                    case '-':
                        result = $scope.operand1 - $scope.operand2
                        break;
                    case '+':
                        result = $scope.operand1 + $scope.operand2
                        break;
                }
                $scope.operand1 = result;
                $scope.operand2 = undefined;
                $scope.consumedOperator = false;
            }
        }
        else { // if you clicked a symbol
            if (sym === 'back') { // backspace pressed
                if ($scope.operand1 === $scope.windowVar) { // if the currently displayed number is the first operand
                    $scope.operand1 = Number($scope.operand1.toString().substring(0, $scope.operand1.toString().length - 1)); // trim the operand by one character
                    $scope.windowVar = $scope.operand1;
                }
                if ($scope.operand2 === $scope.windowVar) { // if the currently displayed number is the second operand
                    $scope.operand2 = Number($scope.operand2.toString().substring(0, $scope.operand2.toString().length - 1)); // trim the operand by one character
                    $scope.windowVar = $scope.operand2;
                }
            }
            else if (sym === 'clear') { // clear everything if clear button pressed
                $scope.operand1 = undefined;
                $scope.operand2 = undefined;
                $scope.windowVar = 0;
                $scope.consumedOperator = false;
            }
            else { // if a symobl was pressed not clear
                $scope.latestOperator = sym === '=' ? $scope.latestOperator : sym; // don't let the latest operator be the equal sign
                if (!$scope.consumedOperator && $scope.operand1 !== undefined) {
                    $scope.consumedOperator = true; // define an operator if the first operand is undefined
                }
            }
            if (sym === '=') {
                $scope.windowVar = $scope.operand1 === undefined ? '0' : $scope.operand1;
            }
        }
        $scope.$apply();
    }

    $(document).ready(function() {
        $('button').on('click', function(e) {
            action(e.target.textContent);
        });
    });

    $(document).bind('keyup', function(e) {
        var newkeypress = new Keypress(e.which, e.altKey, e.ctrlKey, e.metaKey, e.shiftKey);
        if (!newkeypress.compare($scope.oldkeypress)) {
            switch (newkeypress.which) {
                case 48:
                    action('0');
                    break;
                case 49:
                    action('1');
                    break;
                case 50:
                    action('2');
                    break;
                case 51:
                    action('3');
                    break;
                case 52:
                    action('4');
                    break;
                case 53:
                    action('5');
                    break;
                case 54:
                    action('6');
                    break;
                case 55:
                    action('7');
                    break;
                case 56: // 8
                    if (newkeypress.shift) action('*');
                    else action('8');
                    break;
                case 57:
                    action('9');
                    break;
                case 191:
                    action('/');
                    break;
                case 88: // x
                    action('x');
                    break;
                case 189:
                    action('-');
                    break;
                case 187:
                    if (newkeypress.shift) action('+');
                    else action('=');
                    break;
                case 67: // c
                    action('clear');
                    break;
                case 8: // backspace
                    action('back');
                    break;
            }
        }
    });
}]);