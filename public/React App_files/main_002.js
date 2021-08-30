webpackHotUpdate("main",{

/***/ "./src/App/index.tsx":
/*!***************************!*\
  !*** ./src/App/index.tsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/dist/mobxreact.esm.js");
/* harmony import */ var _Dashboard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Dashboard */ "./src/App/Dashboard/index.tsx");
/* harmony import */ var _Auth_SignUp__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Auth/SignUp */ "./src/App/Auth/SignUp/index.ts");
/* harmony import */ var _Auth_SignIn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Auth/SignIn */ "./src/App/Auth/SignIn/index.ts");
/* harmony import */ var _RouteWithLayout__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./RouteWithLayout */ "./src/App/RouteWithLayout/index.tsx");
/* harmony import */ var _layouts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./layouts */ "./src/App/layouts/index.ts");
var _dec,
    _class,
    _jsxFileName = "/usr/app/src/App/index.tsx";









let App = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["inject"])('UiState'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_2__["observer"])(_class = class App extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  get injected() {
    return this.props;
  }

  render() {
    const UiState = this.injected.UiState;
    const path = this.props.location.pathname || '';
    console.log('path', path);
    console.log('UiState', UiState);
    console.log('UiState.isAuthenticated', UiState.isAuthenticated);

    if (!UiState.isAuthenticated && !path.startsWith('/sign-in')) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Redirect"], {
        to: "/sign-in",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 38,
          columnNumber: 11
        }
      });
    }

    if (UiState.isAuthenticated && !path.startsWith('/dashboard')) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Redirect"], {
        to: "/dashboard",
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 43,
          columnNumber: 5
        }
      });
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Switch"], {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 50,
        columnNumber: 4
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_RouteWithLayout__WEBPACK_IMPORTED_MODULE_6__["default"], {
      component: _Auth_SignIn__WEBPACK_IMPORTED_MODULE_5__["default"],
      componentProps: {
        providers: UiState.socialLogInProviders,
        providersLoading: UiState.socialLogInProvidersLoading
      },
      layoutProps: {},
      suspense: true,
      exact: true,
      layout: _layouts__WEBPACK_IMPORTED_MODULE_7__["Minimal"],
      path: "/sign-in",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 51,
        columnNumber: 5
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_RouteWithLayout__WEBPACK_IMPORTED_MODULE_6__["default"], {
      component: _Auth_SignUp__WEBPACK_IMPORTED_MODULE_4__["default"],
      componentProps: {
        providers: UiState.socialLogInProviders,
        providersLoading: UiState.socialLogInProvidersLoading
      },
      layoutProps: {},
      suspense: true,
      exact: true,
      layout: _layouts__WEBPACK_IMPORTED_MODULE_7__["Minimal"],
      path: "/sign-up",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 63,
        columnNumber: 5
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_RouteWithLayout__WEBPACK_IMPORTED_MODULE_6__["default"], {
      component: _Dashboard__WEBPACK_IMPORTED_MODULE_3__["default"],
      suspense: true,
      layout: _layouts__WEBPACK_IMPORTED_MODULE_7__["Main"],
      layoutProps: {},
      path: "/dashboard",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 75,
        columnNumber: 5
      }
    }));
  }

}) || _class) || _class);
/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["withRouter"])(App));

/***/ })

})
//# sourceMappingURL=main.32baa677e9e809fa1bc5.hot-update.js.map