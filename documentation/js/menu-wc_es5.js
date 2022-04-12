'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

customElements.define('compodoc-menu', /*#__PURE__*/function (_HTMLElement) {
  _inherits(_class, _HTMLElement);

  var _super = _createSuper(_class);

  function _class() {
    var _this;

    _classCallCheck(this, _class);

    _this = _super.call(this);
    _this.isNormalMode = _this.getAttribute('mode') === 'normal';
    return _this;
  }

  _createClass(_class, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.render(this.isNormalMode);
    }
  }, {
    key: "render",
    value: function render(isNormalMode) {
      var tp = lithtml.html("\n        <nav>\n            <ul class=\"list\">\n                <li class=\"title\">\n                    <a href=\"index.html\" data-type=\"index-link\">clila-service-api documentation</a>\n                </li>\n\n                <li class=\"divider\"></li>\n                ".concat(isNormalMode ? "<div id=\"book-search-input\" role=\"search\"><input type=\"text\" placeholder=\"Type to search\"></div>" : '', "\n                <li class=\"chapter\">\n                    <a data-type=\"chapter-link\" href=\"index.html\"><span class=\"icon ion-ios-home\"></span>Getting started</a>\n                    <ul class=\"links\">\n                        <li class=\"link\">\n                            <a href=\"overview.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-keypad\"></span>Overview\n                            </a>\n                        </li>\n                        <li class=\"link\">\n                            <a href=\"index.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-paper\"></span>README\n                            </a>\n                        </li>\n                                <li class=\"link\">\n                                    <a href=\"dependencies.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-list\"></span>Dependencies\n                                    </a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"properties.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-apps\"></span>Properties\n                                    </a>\n                                </li>\n                    </ul>\n                </li>\n                    <li class=\"chapter modules\">\n                        <a data-type=\"chapter-link\" href=\"modules.html\">\n                            <div class=\"menu-toggler linked\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"', ">\n                                <span class=\"icon ion-ios-archive\"></span>\n                                <span class=\"link-name\">Modules</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                        </a>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"', ">\n                            <li class=\"link\">\n                                <a href=\"modules/AppModule.html\" data-type=\"entity-link\" >AppModule</a>\n                                    <li class=\"chapter inner\">\n                                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#controllers-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"' : 'data-target="#xs-controllers-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"', ">\n                                            <span class=\"icon ion-md-swap\"></span>\n                                            <span>Controllers</span>\n                                            <span class=\"icon ion-ios-arrow-down\"></span>\n                                        </div>\n                                        <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="controllers-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"' : 'id="xs-controllers-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"', ">\n                                            <li class=\"link\">\n                                                <a href=\"controllers/AppController.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                                <li class=\"chapter inner\">\n                                    <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#injectables-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"' : 'data-target="#xs-injectables-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"', ">\n                                        <span class=\"icon ion-md-arrow-round-down\"></span>\n                                        <span>Injectables</span>\n                                        <span class=\"icon ion-ios-arrow-down\"></span>\n                                    </div>\n                                    <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="injectables-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"' : 'id="xs-injectables-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"', ">\n                                        <li class=\"link\">\n                                            <a href=\"injectables/AppService.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppService</a>\n                                        </li>\n                                        <li class=\"link\">\n                                            <a href=\"injectables/LinkRepository.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >LinkRepository</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/AuthModule.html\" data-type=\"entity-link\" >AuthModule</a>\n                                <li class=\"chapter inner\">\n                                    <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#injectables-links-module-AuthModule-064dbd465d7a1b617482627403098d7637aa3d5466007443889b210b08d9fad8eae38254e85baf25d8544f14ac6fce60e9626cc6353ad335246c9ff03d18595f"' : 'data-target="#xs-injectables-links-module-AuthModule-064dbd465d7a1b617482627403098d7637aa3d5466007443889b210b08d9fad8eae38254e85baf25d8544f14ac6fce60e9626cc6353ad335246c9ff03d18595f"', ">\n                                        <span class=\"icon ion-md-arrow-round-down\"></span>\n                                        <span>Injectables</span>\n                                        <span class=\"icon ion-ios-arrow-down\"></span>\n                                    </div>\n                                    <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="injectables-links-module-AuthModule-064dbd465d7a1b617482627403098d7637aa3d5466007443889b210b08d9fad8eae38254e85baf25d8544f14ac6fce60e9626cc6353ad335246c9ff03d18595f"' : 'id="xs-injectables-links-module-AuthModule-064dbd465d7a1b617482627403098d7637aa3d5466007443889b210b08d9fad8eae38254e85baf25d8544f14ac6fce60e9626cc6353ad335246c9ff03d18595f"', ">\n                                        <li class=\"link\">\n                                            <a href=\"injectables/JwtStrategy.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >JwtStrategy</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/LinksModule.html\" data-type=\"entity-link\" >LinksModule</a>\n                                    <li class=\"chapter inner\">\n                                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#controllers-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"' : 'data-target="#xs-controllers-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"', ">\n                                            <span class=\"icon ion-md-swap\"></span>\n                                            <span>Controllers</span>\n                                            <span class=\"icon ion-ios-arrow-down\"></span>\n                                        </div>\n                                        <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="controllers-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"' : 'id="xs-controllers-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"', ">\n                                            <li class=\"link\">\n                                                <a href=\"controllers/LinksController.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >LinksController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                                <li class=\"chapter inner\">\n                                    <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#injectables-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"' : 'data-target="#xs-injectables-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"', ">\n                                        <span class=\"icon ion-md-arrow-round-down\"></span>\n                                        <span>Injectables</span>\n                                        <span class=\"icon ion-ios-arrow-down\"></span>\n                                    </div>\n                                    <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="injectables-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"' : 'id="xs-injectables-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"', ">\n                                        <li class=\"link\">\n                                            <a href=\"injectables/LinkRepository.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >LinkRepository</a>\n                                        </li>\n                                        <li class=\"link\">\n                                            <a href=\"injectables/LinksService.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >LinksService</a>\n                                        </li>\n                                        <li class=\"link\">\n                                            <a href=\"injectables/UserRepository.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >UserRepository</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/MailModule.html\" data-type=\"entity-link\" >MailModule</a>\n                                <li class=\"chapter inner\">\n                                    <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#injectables-links-module-MailModule-4492a71eb0147288fe592299100a1732d88e2da0ed247df7bde93d8d6734b26a345f0e99630d0bf041550c4858288cb1734b06ed121ab0cd8ef8131c195bf4ea"' : 'data-target="#xs-injectables-links-module-MailModule-4492a71eb0147288fe592299100a1732d88e2da0ed247df7bde93d8d6734b26a345f0e99630d0bf041550c4858288cb1734b06ed121ab0cd8ef8131c195bf4ea"', ">\n                                        <span class=\"icon ion-md-arrow-round-down\"></span>\n                                        <span>Injectables</span>\n                                        <span class=\"icon ion-ios-arrow-down\"></span>\n                                    </div>\n                                    <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="injectables-links-module-MailModule-4492a71eb0147288fe592299100a1732d88e2da0ed247df7bde93d8d6734b26a345f0e99630d0bf041550c4858288cb1734b06ed121ab0cd8ef8131c195bf4ea"' : 'id="xs-injectables-links-module-MailModule-4492a71eb0147288fe592299100a1732d88e2da0ed247df7bde93d8d6734b26a345f0e99630d0bf041550c4858288cb1734b06ed121ab0cd8ef8131c195bf4ea"', ">\n                                        <li class=\"link\">\n                                            <a href=\"injectables/MailService.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >MailService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/UsersModule.html\" data-type=\"entity-link\" >UsersModule</a>\n                                    <li class=\"chapter inner\">\n                                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#controllers-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"' : 'data-target="#xs-controllers-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"', ">\n                                            <span class=\"icon ion-md-swap\"></span>\n                                            <span>Controllers</span>\n                                            <span class=\"icon ion-ios-arrow-down\"></span>\n                                        </div>\n                                        <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="controllers-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"' : 'id="xs-controllers-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"', ">\n                                            <li class=\"link\">\n                                                <a href=\"controllers/UsersController.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >UsersController</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                                <li class=\"chapter inner\">\n                                    <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#injectables-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"' : 'data-target="#xs-injectables-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"', ">\n                                        <span class=\"icon ion-md-arrow-round-down\"></span>\n                                        <span>Injectables</span>\n                                        <span class=\"icon ion-ios-arrow-down\"></span>\n                                    </div>\n                                    <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="injectables-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"' : 'id="xs-injectables-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"', ">\n                                        <li class=\"link\">\n                                            <a href=\"injectables/UserRepository.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >UserRepository</a>\n                                        </li>\n                                        <li class=\"link\">\n                                            <a href=\"injectables/UsersService.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >UsersService</a>\n                                        </li>\n                                    </ul>\n                                </li>\n                            </li>\n                </ul>\n                </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"', ">\n                            <span class=\"icon ion-ios-paper\"></span>\n                            <span>Classes</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"', ">\n                            <li class=\"link\">\n                                <a href=\"classes/CreateLinkDto.html\" data-type=\"entity-link\" >CreateLinkDto</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/CreateRefreshTokenDto.html\" data-type=\"entity-link\" >CreateRefreshTokenDto</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/CreateTokenRecoverPasswordDto.html\" data-type=\"entity-link\" >CreateTokenRecoverPasswordDto</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/CreateUserDto.html\" data-type=\"entity-link\" >CreateUserDto</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/Link.html\" data-type=\"entity-link\" >Link</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/LinkInfos.html\" data-type=\"entity-link\" >LinkInfos</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/LoginUserDto.html\" data-type=\"entity-link\" >LoginUserDto</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/PaginationParamsDto.html\" data-type=\"entity-link\" >PaginationParamsDto</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/QueryUpdateRecoverPasswordDto.html\" data-type=\"entity-link\" >QueryUpdateRecoverPasswordDto</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/RecoverPasswordDto.html\" data-type=\"entity-link\" >RecoverPasswordDto</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/RefreshToken.html\" data-type=\"entity-link\" >RefreshToken</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/ResendEmailDto.html\" data-type=\"entity-link\" >ResendEmailDto</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/Result.html\" data-type=\"entity-link\" >Result</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/UpdateLinkDto.html\" data-type=\"entity-link\" >UpdateLinkDto</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/UpdatePasswordDto.html\" data-type=\"entity-link\" >UpdatePasswordDto</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/User.html\" data-type=\"entity-link\" >User</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/ValidateApiTokenDto.html\" data-type=\"entity-link\" >ValidateApiTokenDto</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/ValidateEmailDto.html\" data-type=\"entity-link\" >ValidateEmailDto</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class=\"chapter\">\n                            <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#injectables-links"' : 'data-target="#xs-injectables-links"', ">\n                                <span class=\"icon ion-md-arrow-round-down\"></span>\n                                <span>Injectables</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                            <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"', ">\n                                <li class=\"link\">\n                                    <a href=\"injectables/JwtAuthGuard.html\" data-type=\"entity-link\" >JwtAuthGuard</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/LinksInterceptor.html\" data-type=\"entity-link\" >LinksInterceptor</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#interfaces-links"' : 'data-target="#xs-interfaces-links"', ">\n                            <span class=\"icon ion-md-information-circle-outline\"></span>\n                            <span>Interfaces</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"', ">\n                            <li class=\"link\">\n                                <a href=\"interfaces/ILinkRepository.html\" data-type=\"entity-link\" >ILinkRepository</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/IUserRepository.html\" data-type=\"entity-link\" >IUserRepository</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/IUserTokenDto.html\" data-type=\"entity-link\" >IUserTokenDto</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"', ">\n                            <span class=\"icon ion-ios-cube\"></span>\n                            <span>Miscellaneous</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"', ">\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/functions.html\" data-type=\"entity-link\">Functions</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/variables.html\" data-type=\"entity-link\">Variables</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <a data-type=\"chapter-link\" href=\"coverage.html\"><span class=\"icon ion-ios-stats\"></span>Documentation coverage</a>\n                    </li>\n                    <li class=\"divider\"></li>\n                    <li class=\"copyright\">\n                        Documentation generated using <a href=\"https://compodoc.app/\" target=\"_blank\">\n                            <img data-src=\"images/compodoc-vectorise.png\" class=\"img-responsive\" data-type=\"compodoc-logo\">\n                        </a>\n                    </li>\n            </ul>\n        </nav>\n        "));
      this.innerHTML = tp.strings;
    }
  }]);

  return _class;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement)));