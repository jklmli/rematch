"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Monapt = require('monapt');
function Rematch(value, clauses) {
    return Rematch.match(value, clauses);
}
var Rematch;
(function (Rematch) {
    var Case = (function () {
        function Case(matches, action) {
            this.matches = matches;
            this.onceAction = _.once(action);
        }
        Case.prototype.result = function (t) { return this.onceAction(t); };
        return Case;
    }());
    Rematch.Case = Case;
    function match(value, clauses) {
        var matched = Monapt.Option(_(clauses)
            .find(function (clause) { return clause.matches(value); }))
            .map(function (clause) { return clause.result(value); });
        return matched
            .getOrElse(function () { throw new Rematch.MatchError(JSON.stringify(value) + " doesn't match any of the possible match clauses."); });
    }
    Rematch.match = match;
    Rematch.isEqual = _.isEqual;
    function Value(key, action) {
        return new Case(function (value) { return Rematch.isEqual(key, value); }, action);
    }
    Rematch.Value = Value;
    function Values(keys, action) {
        return new Case(function (value) { return _(keys).some(function (key) { return Rematch.isEqual(key, value); }); }, action);
    }
    Rematch.Values = Values;
    function Type(key, action) {
        return new Case(function (value) { return value instanceof key; }, action);
    }
    Rematch.Type = Type;
    function Else(action) {
        return new Case(function (value) { return true; }, action);
    }
    Rematch.Else = Else;
    var MatchError = (function (_super) {
        __extends(MatchError, _super);
        function MatchError(message) {
            if (message === void 0) { message = ''; }
            _super.call(this, message);
            this.name = 'MatchError';
            this.message = message;
        }
        MatchError.prototype.toString = function () {
            return this.name + ': ' + this.message;
        };
        return MatchError;
    }(Error));
    Rematch.MatchError = MatchError;
})(Rematch || (Rematch = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Rematch;
