'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">clila-service-api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"' : 'data-target="#xs-controllers-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"' :
                                            'id="xs-controllers-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"' : 'data-target="#xs-injectables-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"' :
                                        'id="xs-injectables-links-module-AppModule-eb3d0f765c98e43d3da19fe288b0d93f36a64c93b4e289375470b8b9ad5cb066e86b07df27b6bfc70f5d8722a6089a098a6f8cc5d7bc42f253329a6f619ea75f"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LinkRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LinkRepository</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-064dbd465d7a1b617482627403098d7637aa3d5466007443889b210b08d9fad8eae38254e85baf25d8544f14ac6fce60e9626cc6353ad335246c9ff03d18595f"' : 'data-target="#xs-injectables-links-module-AuthModule-064dbd465d7a1b617482627403098d7637aa3d5466007443889b210b08d9fad8eae38254e85baf25d8544f14ac6fce60e9626cc6353ad335246c9ff03d18595f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-064dbd465d7a1b617482627403098d7637aa3d5466007443889b210b08d9fad8eae38254e85baf25d8544f14ac6fce60e9626cc6353ad335246c9ff03d18595f"' :
                                        'id="xs-injectables-links-module-AuthModule-064dbd465d7a1b617482627403098d7637aa3d5466007443889b210b08d9fad8eae38254e85baf25d8544f14ac6fce60e9626cc6353ad335246c9ff03d18595f"' }>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LinksModule.html" data-type="entity-link" >LinksModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"' : 'data-target="#xs-controllers-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"' :
                                            'id="xs-controllers-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"' }>
                                            <li class="link">
                                                <a href="controllers/LinksController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LinksController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"' : 'data-target="#xs-injectables-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"' :
                                        'id="xs-injectables-links-module-LinksModule-6b4d0ea872f395d01a1be111ab246d12b699286f853a2b47edd78471564b3108ca8a1f17dadb014a7d8d99b7b9ab2be8c25344fc8468ec7fefba86f760a01700"' }>
                                        <li class="link">
                                            <a href="injectables/LinkRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LinkRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LinksService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LinksService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserRepository</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link" >MailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-MailModule-4492a71eb0147288fe592299100a1732d88e2da0ed247df7bde93d8d6734b26a345f0e99630d0bf041550c4858288cb1734b06ed121ab0cd8ef8131c195bf4ea"' : 'data-target="#xs-injectables-links-module-MailModule-4492a71eb0147288fe592299100a1732d88e2da0ed247df7bde93d8d6734b26a345f0e99630d0bf041550c4858288cb1734b06ed121ab0cd8ef8131c195bf4ea"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailModule-4492a71eb0147288fe592299100a1732d88e2da0ed247df7bde93d8d6734b26a345f0e99630d0bf041550c4858288cb1734b06ed121ab0cd8ef8131c195bf4ea"' :
                                        'id="xs-injectables-links-module-MailModule-4492a71eb0147288fe592299100a1732d88e2da0ed247df7bde93d8d6734b26a345f0e99630d0bf041550c4858288cb1734b06ed121ab0cd8ef8131c195bf4ea"' }>
                                        <li class="link">
                                            <a href="injectables/MailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"' : 'data-target="#xs-controllers-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"' :
                                            'id="xs-controllers-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"' : 'data-target="#xs-injectables-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"' :
                                        'id="xs-injectables-links-module-UsersModule-0f15a1fe9b78fc9706fd631ecd0e0204dee8c524183e3832c719bd262241f610565c9c85a1d1ec5bb728a488d755b0e77d99f57db7498cce7a672fe446ec1e87"' }>
                                        <li class="link">
                                            <a href="injectables/UserRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreateLinkDto.html" data-type="entity-link" >CreateLinkDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRefreshTokenDto.html" data-type="entity-link" >CreateRefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTokenRecoverPasswordDto.html" data-type="entity-link" >CreateTokenRecoverPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Link.html" data-type="entity-link" >Link</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinkInfos.html" data-type="entity-link" >LinkInfos</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginUserDto.html" data-type="entity-link" >LoginUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationParamsDto.html" data-type="entity-link" >PaginationParamsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryUpdateRecoverPasswordDto.html" data-type="entity-link" >QueryUpdateRecoverPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RecoverPasswordDto.html" data-type="entity-link" >RecoverPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshToken.html" data-type="entity-link" >RefreshToken</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResendEmailDto.html" data-type="entity-link" >ResendEmailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Result.html" data-type="entity-link" >Result</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateLinkDto.html" data-type="entity-link" >UpdateLinkDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePasswordDto.html" data-type="entity-link" >UpdatePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidateApiTokenDto.html" data-type="entity-link" >ValidateApiTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidateEmailDto.html" data-type="entity-link" >ValidateEmailDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LinksInterceptor.html" data-type="entity-link" >LinksInterceptor</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ILinkRepository.html" data-type="entity-link" >ILinkRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserRepository.html" data-type="entity-link" >IUserRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserTokenDto.html" data-type="entity-link" >IUserTokenDto</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});