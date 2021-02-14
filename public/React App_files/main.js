(this["webpackJsonpsocial-auth-client"] = this["webpackJsonpsocial-auth-client"] || []).push([["main"],{

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./src/index.css":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-3-1!./node_modules/postcss-loader/src??postcss!./src/index.css ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "body {\n  margin: 0;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  height: 100%;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "./src/App/Auth/SignIn/SignIn.tsx":
/*!****************************************!*\
  !*** ./src/App/Auth/SignIn/SignIn.tsx ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var validate_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! validate.js */ "./node_modules/validate.js/validate.js");
/* harmony import */ var validate_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(validate_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _material_ui_styles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/styles */ "./node_modules/@material-ui/styles/esm/index.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");
/* harmony import */ var react_social_login_buttons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-social-login-buttons */ "./node_modules/react-social-login-buttons/dist/index.js");
/* harmony import */ var react_social_login_buttons__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_social_login_buttons__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _mobx_auth__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../mobx/auth */ "./src/mobx/auth.ts");


var _jsxFileName = "/usr/app/src/App/Auth/SignIn/SignIn.tsx";







const schema = {
  email: {
    presence: {
      allowEmpty: false,
      message: 'is required'
    },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: {
      allowEmpty: false,
      message: 'is required'
    },
    length: {
      maximum: 128
    }
  }
};
const useStyles = Object(_material_ui_styles__WEBPACK_IMPORTED_MODULE_5__["makeStyles"])(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  person: {},
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.primary.light,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.primary.light,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.primary.light
  },
  bio: {
    color: theme.palette.primary.light
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    // paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  SignInButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignIn = props => {
  const history = props.history,
        providers = props.providers,
        providersLoading = props.providersLoading;
  const classes = useStyles();

  const _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])({
    isValid: false,
    authError: false,
    values: {},
    touched: {},
    errors: {}
  }),
        _useState2 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
        formState = _useState2[0],
        setFormState = _useState2[1];

  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(() => {
    const errors = validate_js__WEBPACK_IMPORTED_MODULE_4___default()(formState.values, schema);
    setFormState(formState => Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, formState), {}, {
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleBack = () => {
    history.goBack();
  };

  const handleChange = event => {
    event.persist();
    setFormState(formState => Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, formState), {}, {
      values: Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, formState.values), {}, {
        [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
      }),
      touched: Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, formState.touched), {}, {
        [event.target.name]: true
      })
    }));
  };

  const handleSignIn = type => {
    if (type === 'local') {
      _mobx_auth__WEBPACK_IMPORTED_MODULE_8__["default"].authenticate(formState.values).then(res => {
        if (res) {
          setFormState(formState => Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, formState), {}, {
            authError: true
          }));
        }
      });
      return;
    }

    window.location.href = '/api/auth/' + type; // history.push('/api/auth' + type);
  };

  const hasError = field => formState.touched[field] && formState.errors[field] ? true : false;

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: classes.root,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 216,
      columnNumber: 3
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Grid"], {
    className: classes.grid,
    justify: "center",
    container: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 217,
      columnNumber: 4
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Grid"], {
    className: classes.content,
    item: true,
    lg: 7,
    xs: 12,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 218,
      columnNumber: 5
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: classes.content,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 219,
      columnNumber: 6
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: classes.contentHeader,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 220,
      columnNumber: 7
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: classes.contentBody,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 225,
      columnNumber: 7
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Typography"], {
    className: classes.title,
    variant: "h2",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 226,
      columnNumber: 8
    }
  }, "Sign in"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Grid"], {
    className: classes.socialButtons,
    container: true // spacing={2}
    ,
    justify: "center",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 230,
      columnNumber: 8
    }
  }, providers.includes('github') ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Grid"], {
    item: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 238,
      columnNumber: 11
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react_social_login_buttons__WEBPACK_IMPORTED_MODULE_7__["GithubLoginButton"], {
    onClick: () => handleSignIn('github'),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 239,
      columnNumber: 12
    }
  }))) : null, providers.includes('facebook') ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Grid"], {
    item: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 247,
      columnNumber: 11
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react_social_login_buttons__WEBPACK_IMPORTED_MODULE_7__["FacebookLoginButton"], {
    onClick: () => handleSignIn('facebook'),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 248,
      columnNumber: 12
    }
  }))) : null, providers.includes('google') ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Grid"], {
    item: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 256,
      columnNumber: 11
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react_social_login_buttons__WEBPACK_IMPORTED_MODULE_7__["GoogleLoginButton"], {
    onClick: () => handleSignIn('google'),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 257,
      columnNumber: 12
    }
  }))) : null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("form", {
    action: "/api/auth/SignIn",
    method: "post",
    className: classes.form,
    onSubmit: e => {
      e.preventDefault();
      handleSignIn('local');
    },
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 265,
      columnNumber: 8
    }
  }, providers.includes('login') ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Typography"], {
    align: "center",
    className: classes.sugestion,
    color: "textSecondary",
    variant: "body1",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 276,
      columnNumber: 11
    }
  }, "or sign in with email address"), formState.authError ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Typography"], {
    color: "error",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 285,
      columnNumber: 12
    }
  }, "Cannot sign in") : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["TextField"], {
    className: classes.textField,
    error: hasError('email'),
    fullWidth: true,
    helperText: hasError('email') ? formState.errors.email[0] : null,
    label: "Email address",
    name: "email",
    onChange: handleChange,
    type: "text",
    value: formState.values.email || '',
    variant: "outlined",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 287,
      columnNumber: 11
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["TextField"], {
    className: classes.textField,
    error: hasError('password'),
    fullWidth: true,
    helperText: hasError('password') ? formState.errors.password[0] : null,
    label: "Password",
    name: "password",
    onChange: handleChange,
    type: "password",
    value: formState.values.password || '',
    variant: "outlined",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 301,
      columnNumber: 11
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Button"], {
    className: classes.SignInButton,
    color: "primary",
    disabled: !formState.isValid,
    fullWidth: true,
    size: "large",
    type: "submit",
    variant: "contained",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 318,
      columnNumber: 11
    }
  }, "Sign in now")) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Typography"], {
    color: "textSecondary",
    variant: "body1",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 332,
      columnNumber: 9
    }
  }, "Don't have an account?", ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Link"], {
    component: react_router_dom__WEBPACK_IMPORTED_MODULE_3__["Link"],
    to: "/sign-up",
    variant: "h6",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 334,
      columnNumber: 10
    }
  }, "Sign up"))))))));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_3__["withRouter"])(SignIn));

/***/ }),

/***/ "./src/App/Auth/SignIn/index.ts":
/*!**************************************!*\
  !*** ./src/App/Auth/SignIn/index.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SignIn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SignIn */ "./src/App/Auth/SignIn/SignIn.tsx");

/* harmony default export */ __webpack_exports__["default"] = (_SignIn__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/App/Auth/SignUp/SignUp.tsx":
/*!****************************************!*\
  !*** ./src/App/Auth/SignUp/SignUp.tsx ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var validate_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! validate.js */ "./node_modules/validate.js/validate.js");
/* harmony import */ var validate_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(validate_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_social_login_buttons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-social-login-buttons */ "./node_modules/react-social-login-buttons/dist/index.js");
/* harmony import */ var react_social_login_buttons__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_social_login_buttons__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _material_ui_styles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @material-ui/styles */ "./node_modules/@material-ui/styles/esm/index.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");
/* harmony import */ var _mobx_auth__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../mobx/auth */ "./src/mobx/auth.ts");


var _jsxFileName = "/usr/app/src/App/Auth/SignUp/SignUp.tsx";







const schema = {
  email: {
    presence: {
      allowEmpty: false,
      message: 'is required'
    },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: {
      allowEmpty: false,
      message: 'is required'
    },
    length: {
      maximum: 128,
      minimum: 8
    }
  },
  policy: {
    presence: {
      allowEmpty: false,
      message: 'is required'
    },
    inclusion: {
      within: [true],
      message: '^You need to accept the terms and conditions'
    }
  }
};
const useStyles = Object(_material_ui_styles__WEBPACK_IMPORTED_MODULE_6__["makeStyles"])(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.primary.light,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  person: {},
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.primary.light,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.primary.light
  },
  bio: {
    color: theme.palette.primary.light
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  policyText: {},
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    // paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignUp = props => {
  const history = props.history,
        providers = props.providers,
        providersLoading = props.providersLoading;
  const classes = useStyles();

  const _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  }),
        _useState2 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
        formState = _useState2[0],
        setFormState = _useState2[1];

  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(() => {
    const errors = validate_js__WEBPACK_IMPORTED_MODULE_4___default()(formState.values, schema);
    setFormState(formState => Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, formState), {}, {
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();
    setFormState(formState => Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, formState), {}, {
      values: Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, formState.values), {}, {
        [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
      }),
      touched: Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, formState.touched), {}, {
        [event.target.name]: true
      })
    }));
  };

  const handleBack = () => {
    history.goBack();
  };

  const handleSignUp = event => {
    event.preventDefault();
    history.push('/');
  };

  const hasError = field => formState.touched[field] && formState.errors[field] ? true : false;

  const handleLogIn = type => {
    if (type === 'local') {
      _mobx_auth__WEBPACK_IMPORTED_MODULE_8__["default"].authenticate(formState.values).then(res => {
        if (res) {
          setFormState(formState => Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, formState), {}, {
            authError: true
          }));
        }
      });
      return;
    }

    window.location.href = '/api/auth/' + type; // history.push('/api/auth' + type);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: classes.root,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 230,
      columnNumber: 3
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Grid"], {
    className: classes.grid,
    justify: "center",
    container: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 231,
      columnNumber: 4
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Grid"], {
    className: classes.content,
    item: true,
    lg: 7,
    xs: 12,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 232,
      columnNumber: 5
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: classes.content,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 233,
      columnNumber: 6
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: classes.contentHeader,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 234,
      columnNumber: 7
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: classes.contentBody,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 239,
      columnNumber: 7
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Typography"], {
    className: classes.title,
    variant: "h2",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 240,
      columnNumber: 8
    }
  }, "Create new account"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Grid"], {
    className: classes.socialButtons,
    container: true // spacing={2}
    ,
    justify: "center",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 243,
      columnNumber: 8
    }
  }, providers.includes('github') ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Grid"], {
    item: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 251,
      columnNumber: 11
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react_social_login_buttons__WEBPACK_IMPORTED_MODULE_5__["GithubLoginButton"], {
    onClick: () => handleLogIn('github'),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 252,
      columnNumber: 12
    }
  }))) : null, providers.includes('facebook') ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Grid"], {
    item: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 260,
      columnNumber: 11
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react_social_login_buttons__WEBPACK_IMPORTED_MODULE_5__["FacebookLoginButton"], {
    onClick: () => handleLogIn('facebook'),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 261,
      columnNumber: 12
    }
  }))) : null, providers.includes('google') ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Grid"], {
    item: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 269,
      columnNumber: 11
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react_social_login_buttons__WEBPACK_IMPORTED_MODULE_5__["GoogleLoginButton"], {
    onClick: () => handleLogIn('google'),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 270,
      columnNumber: 12
    }
  }))) : null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("form", {
    className: classes.form,
    action: "/api/auth/create-account",
    method: "post" // onSubmit={handleSignUp}
    ,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 277,
      columnNumber: 8
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["TextField"], {
    className: classes.textField,
    error: hasError('email'),
    fullWidth: true,
    helperText: hasError('email') ? formState.errors.email[0] : null,
    label: "Email address",
    name: "email",
    onChange: handleChange,
    type: "text",
    value: formState.values.email || '',
    variant: "outlined",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 283,
      columnNumber: 9
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["TextField"], {
    className: classes.textField,
    error: hasError('password'),
    fullWidth: true,
    helperText: hasError('password') ? formState.errors.password[0] : null,
    label: "Password",
    name: "password",
    onChange: handleChange,
    type: "password",
    value: formState.values.password || '',
    variant: "outlined",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 297,
      columnNumber: 9
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: classes.policy,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 311,
      columnNumber: 9
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Checkbox"], {
    checked: formState.values.policy || false,
    className: classes.policyCheckbox,
    color: "primary",
    name: "policy",
    onChange: handleChange,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 312,
      columnNumber: 10
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Typography"], {
    className: classes.policyText,
    color: "textSecondary",
    variant: "body1",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 319,
      columnNumber: 10
    }
  }, "I have read the", ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("a", {
    // color="primary"
    // component={Redirect}
    target: "_blank",
    rel: "noopener noreferrer",
    href: "/terms" // underline="always"
    // variant="h6"
    ,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 325,
      columnNumber: 11
    }
  }, "Terms and Conditions"))), hasError('policy') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["FormHelperText"], {
    error: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 339,
      columnNumber: 10
    }
  }, formState.errors.policy[0]), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Button"], {
    className: classes.signUpButton,
    color: "primary",
    disabled: !formState.isValid,
    fullWidth: true,
    size: "large",
    type: "submit",
    variant: "contained",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 343,
      columnNumber: 9
    }
  }, "Sign up now"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Typography"], {
    color: "textSecondary",
    variant: "body1",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 354,
      columnNumber: 9
    }
  }, "Have an account?", ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Link"], {
    component: react_router_dom__WEBPACK_IMPORTED_MODULE_3__["Link"],
    to: "/sign-in",
    variant: "h6",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 356,
      columnNumber: 10
    }
  }, "Sign in"))))))));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_3__["withRouter"])(SignUp));

/***/ }),

/***/ "./src/App/Auth/SignUp/index.ts":
/*!**************************************!*\
  !*** ./src/App/Auth/SignUp/index.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SignUp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SignUp */ "./src/App/Auth/SignUp/SignUp.tsx");

/* harmony default export */ __webpack_exports__["default"] = (_SignUp__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/App/Dashboard/index.tsx":
/*!*************************************!*\
  !*** ./src/App/Dashboard/index.tsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/dist/mobxreact.esm.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/index.js");
var _dec,
    _class,
    _temp,
    _jsxFileName = "/usr/app/src/App/Dashboard/index.tsx";




let Dashboard = (_dec = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["inject"])('UserState'), _dec(_class = Object(mobx_react__WEBPACK_IMPORTED_MODULE_1__["observer"])(_class = (_temp = class Dashboard extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(...args) {
    super(...args);

    this.componentDidMount = () => {
      this.injected.UserState.pullUser();
    };
  }

  get injected() {
    return this.props;
  }

  render() {
    const t = this.props.t;
    const UserState = this.injected.UserState;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "wrapper",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 28,
        columnNumber: 4
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 29,
        columnNumber: 5
      }
    }, t('dashboard')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 30,
        columnNumber: 5
      }
    }, "".concat(UserState.loading)), UserState.id && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 31,
        columnNumber: 22
      }
    }, "".concat(UserState.id)));
  }

}, _temp)) || _class) || _class);
/* harmony default export */ __webpack_exports__["default"] = (Object(react_i18next__WEBPACK_IMPORTED_MODULE_2__["withTranslation"])()(Dashboard));

/***/ }),

/***/ "./src/App/RouteWithLayout/index.tsx":
/*!*******************************************!*\
  !*** ./src/App/RouteWithLayout/index.tsx ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var _SuspenseLoading__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../SuspenseLoading */ "./src/App/SuspenseLoading/index.tsx");

var _jsxFileName = "/usr/app/src/App/RouteWithLayout/index.tsx";




const RouteWithLayout = props => {
  const suspense = props.suspense,
        Layout = props.layout,
        Component = props.component,
        componentProps = props.componentProps,
        layoutProps = props.layoutProps,
        children = props.children,
        rest = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(props, ["suspense", "layout", "component", "componentProps", "layoutProps", "children"]);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], Object.assign({}, rest, {
    render: matchProps => suspense ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1__["Suspense"], {
      fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_SuspenseLoading__WEBPACK_IMPORTED_MODULE_3__["default"], {
        __self: undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 33,
          columnNumber: 26
        }
      }),
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 33,
        columnNumber: 6
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Layout, Object.assign({}, layoutProps, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 34,
        columnNumber: 7
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Component, Object.assign({}, matchProps, componentProps, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 35,
        columnNumber: 8
      }
    })))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Layout, Object.assign({}, layoutProps, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 39,
        columnNumber: 6
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Component, Object.assign({}, matchProps, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 40,
        columnNumber: 7
      }
    }))),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29,
      columnNumber: 3
    }
  }), children);
};

/* harmony default export */ __webpack_exports__["default"] = (RouteWithLayout);

/***/ }),

/***/ "./src/App/SuspenseLoading/index.tsx":
/*!*******************************************!*\
  !*** ./src/App/SuspenseLoading/index.tsx ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _jsxFileName = "/usr/app/src/App/SuspenseLoading/index.tsx";


const SuspenseLoading = () => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 4,
      columnNumber: 9
    }
  }, "Loading...");
};

/* harmony default export */ __webpack_exports__["default"] = (SuspenseLoading);

/***/ }),

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

/***/ }),

/***/ "./src/App/layouts/Main/components/Footer/Footer.tsx":
/*!***********************************************************!*\
  !*** ./src/App/layouts/Main/components/Footer/Footer.tsx ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.m.js");
/* harmony import */ var _material_ui_styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/styles */ "./node_modules/@material-ui/styles/esm/index.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");

var _jsxFileName = "/usr/app/src/App/layouts/Main/components/Footer/Footer.tsx";




const useStyles = Object(_material_ui_styles__WEBPACK_IMPORTED_MODULE_3__["makeStyles"])(theme => ({
  root: {
    padding: theme.spacing(4),
    left: 0,
    bottom: 0,
    width: '100%',
    // backgroundColor: '#e9ecef',
    textAlign: 'center'
  }
}));

const Footer = props => {
  const className = props.className,
        rest = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(props, ["className"]);

  const classes = useStyles();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", Object.assign({}, rest, {
    className: Object(clsx__WEBPACK_IMPORTED_MODULE_2__["default"])(classes.root, className),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28,
      columnNumber: 3
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__["Typography"], {
    variant: "body1",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29,
      columnNumber: 4
    }
  }, "\xA9", ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__["Link"], {
    component: "a",
    href: "https://localhost/",
    target: "_blank",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31,
      columnNumber: 5
    }
  }, "Pricemon"), ". 2020"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__["Typography"], {
    variant: "caption",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36,
      columnNumber: 4
    }
  }, "Created with love for the environment. By designers and developers who love to work together in offices!"));
};

/* harmony default export */ __webpack_exports__["default"] = (Footer);

/***/ }),

/***/ "./src/App/layouts/Main/components/Footer/index.ts":
/*!*********************************************************!*\
  !*** ./src/App/layouts/Main/components/Footer/index.ts ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Footer */ "./src/App/layouts/Main/components/Footer/Footer.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _Footer__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/App/layouts/Main/components/Sidebar/Sidebar.js":
/*!************************************************************!*\
  !*** ./src/App/layouts/Main/components/Sidebar/Sidebar.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.m.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _material_ui_styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/styles */ "./node_modules/@material-ui/styles/esm/index.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");
/* harmony import */ var _material_ui_icons_Dashboard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @material-ui/icons/Dashboard */ "./node_modules/@material-ui/icons/Dashboard.js");
/* harmony import */ var _material_ui_icons_Dashboard__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_Dashboard__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _material_ui_icons_People__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material-ui/icons/People */ "./node_modules/@material-ui/icons/People.js");
/* harmony import */ var _material_ui_icons_People__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_People__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _material_ui_icons_ShoppingBasket__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @material-ui/icons/ShoppingBasket */ "./node_modules/@material-ui/icons/ShoppingBasket.js");
/* harmony import */ var _material_ui_icons_ShoppingBasket__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_ShoppingBasket__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _material_ui_icons_TextFields__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @material-ui/icons/TextFields */ "./node_modules/@material-ui/icons/TextFields.js");
/* harmony import */ var _material_ui_icons_TextFields__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_TextFields__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _material_ui_icons_Image__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @material-ui/icons/Image */ "./node_modules/@material-ui/icons/Image.js");
/* harmony import */ var _material_ui_icons_Image__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_Image__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _material_ui_icons_AccountBox__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @material-ui/icons/AccountBox */ "./node_modules/@material-ui/icons/AccountBox.js");
/* harmony import */ var _material_ui_icons_AccountBox__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_AccountBox__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _material_ui_icons_Settings__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @material-ui/icons/Settings */ "./node_modules/@material-ui/icons/Settings.js");
/* harmony import */ var _material_ui_icons_Settings__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_Settings__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _material_ui_icons_LockOpen__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @material-ui/icons/LockOpen */ "./node_modules/@material-ui/icons/LockOpen.js");
/* harmony import */ var _material_ui_icons_LockOpen__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_LockOpen__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components */ "./src/App/layouts/Main/components/Sidebar/components/index.ts");

var _jsxFileName = "/usr/app/src/App/layouts/Main/components/Sidebar/Sidebar.js";














const useStyles = Object(_material_ui_styles__WEBPACK_IMPORTED_MODULE_4__["makeStyles"])(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const open = props.open,
        variant = props.variant,
        onClose = props.onClose,
        className = props.className,
        rest = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(props, ["open", "variant", "onClose", "className"]);

  const classes = useStyles();
  const pages = [{
    title: 'Dashboard',
    href: '/dashboard',
    icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_icons_Dashboard__WEBPACK_IMPORTED_MODULE_6___default.a, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 49,
        columnNumber: 10
      }
    })
  }, {
    title: 'Account',
    href: '/dashboard/account',
    icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_icons_AccountBox__WEBPACK_IMPORTED_MODULE_11___default.a, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 54,
        columnNumber: 10
      }
    })
  }, {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_icons_Settings__WEBPACK_IMPORTED_MODULE_12___default.a, {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 59,
        columnNumber: 10
      }
    })
  }];
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__["Drawer"], {
    anchor: "left",
    classes: {
      paper: classes.drawer
    },
    onClose: onClose,
    open: open,
    variant: variant,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64,
      columnNumber: 3
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", Object.assign({}, rest, {
    className: Object(clsx__WEBPACK_IMPORTED_MODULE_2__["default"])(classes.root, className),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71,
      columnNumber: 4
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components__WEBPACK_IMPORTED_MODULE_14__["Profile"], {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72,
      columnNumber: 5
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__["Divider"], {
    className: classes.divider,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 73,
      columnNumber: 5
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components__WEBPACK_IMPORTED_MODULE_14__["SidebarNav"], {
    className: classes.nav,
    pages: pages,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74,
      columnNumber: 5
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components__WEBPACK_IMPORTED_MODULE_14__["SidebarFooter"], {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 75,
      columnNumber: 5
    }
  })));
};

Sidebar.propTypes = {
  className: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.string,
  onClose: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.func,
  open: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.bool.isRequired,
  variant: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.string.isRequired
};
/* harmony default export */ __webpack_exports__["default"] = (Sidebar);

/***/ }),

/***/ "./src/App/layouts/Main/components/Sidebar/components/Profile/Profile.js":
/*!*******************************************************************************!*\
  !*** ./src/App/layouts/Main/components/Sidebar/components/Profile/Profile.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.m.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _material_ui_styles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/styles */ "./node_modules/@material-ui/styles/esm/index.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");

var _jsxFileName = "/usr/app/src/App/layouts/Main/components/Sidebar/components/Profile/Profile.js";






const useStyles = Object(_material_ui_styles__WEBPACK_IMPORTED_MODULE_5__["makeStyles"])(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = props => {
  const className = props.className,
        rest = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(props, ["className"]);

  const classes = useStyles();
  const user = {
    name: 'Shen Zhi',
    avatar: '/images/avatars/avatar_11.png',
    bio: 'Brain Director'
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", Object.assign({}, rest, {
    className: Object(clsx__WEBPACK_IMPORTED_MODULE_3__["default"])(classes.root, className),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36,
      columnNumber: 5
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Avatar"], {
    alt: "Person",
    className: classes.avatar,
    component: react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"],
    src: user.avatar,
    to: "/settings",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40,
      columnNumber: 7
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Typography"], {
    className: classes.name,
    variant: "h4",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47,
      columnNumber: 7
    }
  }, user.name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Typography"], {
    variant: "body2",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53,
      columnNumber: 7
    }
  }, user.bio));
};

Profile.propTypes = {
  className: prop_types__WEBPACK_IMPORTED_MODULE_4___default.a.string
};
/* harmony default export */ __webpack_exports__["default"] = (Profile);

/***/ }),

/***/ "./src/App/layouts/Main/components/Sidebar/components/Profile/index.js":
/*!*****************************************************************************!*\
  !*** ./src/App/layouts/Main/components/Sidebar/components/Profile/index.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Profile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Profile */ "./src/App/layouts/Main/components/Sidebar/components/Profile/Profile.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _Profile__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/App/layouts/Main/components/Sidebar/components/SidebarFooter.js":
/*!*****************************************************************************!*\
  !*** ./src/App/layouts/Main/components/Sidebar/components/SidebarFooter.js ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.m.js");
/* harmony import */ var _material_ui_styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/styles */ "./node_modules/@material-ui/styles/esm/index.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");

var _jsxFileName = "/usr/app/src/App/layouts/Main/components/Sidebar/components/SidebarFooter.js";





const useStyles = Object(_material_ui_styles__WEBPACK_IMPORTED_MODULE_4__["makeStyles"])(theme => ({
  root: {
    left: 0,
    bottom: 0,
    width: '100%',
    // backgroundColor: '#e9ecef',
    textAlign: 'center'
  }
}));

const Footer = props => {
  const className = props.className,
        rest = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(props, ["className"]);

  const classes = useStyles();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", Object.assign({}, rest, {
    className: Object(clsx__WEBPACK_IMPORTED_MODULE_3__["default"])(classes.root, className),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23,
      columnNumber: 3
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__["Typography"], {
    variant: "body1",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24,
      columnNumber: 4
    }
  }, "\xA9", ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__["Link"], {
    component: "a",
    href: "https://localhost/",
    target: "_blank",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26,
      columnNumber: 5
    }
  }, "Pricemon"), ". 2020"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__["Typography"], {
    variant: "caption",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31,
      columnNumber: 4
    }
  }, "Created with love for the environment. By designers and developers who love to work together in offices!"));
};

Footer.propTypes = {
  className: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string
};
/* harmony default export */ __webpack_exports__["default"] = (Footer);

/***/ }),

/***/ "./src/App/layouts/Main/components/Sidebar/components/SidebarNav/SidebarNav.js":
/*!*************************************************************************************!*\
  !*** ./src/App/layouts/Main/components/Sidebar/components/SidebarNav/SidebarNav.js ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.m.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _material_ui_styles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/styles */ "./node_modules/@material-ui/styles/esm/index.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");

var _jsxFileName = "/usr/app/src/App/layouts/Main/components/Sidebar/components/SidebarNav/SidebarNav.js";

/* eslint-disable react/no-multi-comp */

/* eslint-disable react/display-name */






const useStyles = Object(_material_ui_styles__WEBPACK_IMPORTED_MODULE_5__["makeStyles"])(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: _material_ui_core__WEBPACK_IMPORTED_MODULE_6__["colors"].blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
}));
const CustomRouterLink = Object(react__WEBPACK_IMPORTED_MODULE_1__["forwardRef"])((props, ref) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
  ref: ref,
  style: {
    flexGrow: 1
  },
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 44,
    columnNumber: 3
  }
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["NavLink"], Object.assign({}, props, {
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 48,
    columnNumber: 5
  }
}))));

const SidebarNav = props => {
  const pages = props.pages,
        className = props.className,
        rest = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(props, ["pages", "className"]);

  const classes = useStyles();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["List"], Object.assign({}, rest, {
    className: Object(clsx__WEBPACK_IMPORTED_MODULE_3__["default"])(classes.root, className),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58,
      columnNumber: 5
    }
  }), pages.map(page => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["ListItem"], {
    className: classes.item,
    disableGutters: true,
    key: page.title,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 63,
      columnNumber: 9
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_6__["Button"], {
    activeClassName: classes.active,
    className: classes.button,
    component: CustomRouterLink,
    to: page.href,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68,
      columnNumber: 11
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: classes.icon,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74,
      columnNumber: 13
    }
  }, page.icon), page.title))));
};

SidebarNav.propTypes = {
  className: prop_types__WEBPACK_IMPORTED_MODULE_4___default.a.string,
  pages: prop_types__WEBPACK_IMPORTED_MODULE_4___default.a.array.isRequired
};
/* harmony default export */ __webpack_exports__["default"] = (SidebarNav);

/***/ }),

/***/ "./src/App/layouts/Main/components/Sidebar/components/SidebarNav/index.js":
/*!********************************************************************************!*\
  !*** ./src/App/layouts/Main/components/Sidebar/components/SidebarNav/index.js ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SidebarNav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SidebarNav */ "./src/App/layouts/Main/components/Sidebar/components/SidebarNav/SidebarNav.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _SidebarNav__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/App/layouts/Main/components/Sidebar/components/UpgradePlan/UpgradePlan.js":
/*!***************************************************************************************!*\
  !*** ./src/App/layouts/Main/components/Sidebar/components/UpgradePlan/UpgradePlan.js ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.m.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _material_ui_styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/styles */ "./node_modules/@material-ui/styles/esm/index.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");

var _jsxFileName = "/usr/app/src/App/layouts/Main/components/Sidebar/components/UpgradePlan/UpgradePlan.js";





const useStyles = Object(_material_ui_styles__WEBPACK_IMPORTED_MODULE_4__["makeStyles"])(theme => ({
  root: {
    backgroundColor: _material_ui_core__WEBPACK_IMPORTED_MODULE_5__["colors"].grey[50]
  },
  media: {
    paddingTop: theme.spacing(2),
    height: 80,
    textAlign: 'center',
    '& > img': {
      height: '100%',
      width: 'auto'
    }
  },
  content: {
    padding: theme.spacing(1, 2)
  },
  actions: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    justifyContent: 'center'
  }
}));

const UpgradePlan = props => {
  const className = props.className,
        rest = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(props, ["className"]);

  const classes = useStyles();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", Object.assign({}, rest, {
    className: Object(clsx__WEBPACK_IMPORTED_MODULE_2__["default"])(classes.root, className),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36,
      columnNumber: 5
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: classes.media,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40,
      columnNumber: 7
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("img", {
    alt: "Upgrade to PRO",
    src: "/images/undraw_resume_folder_2_arse.svg",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41,
      columnNumber: 9
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: classes.content,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46,
      columnNumber: 7
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__["Typography"], {
    align: "center",
    gutterBottom: true,
    variant: "h6",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47,
      columnNumber: 9
    }
  }, "Upgrade to PRO"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__["Typography"], {
    align: "center",
    variant: "body2",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54,
      columnNumber: 9
    }
  }, "Upgrade to Devias Kit PRO and get even more components")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: classes.actions,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 61,
      columnNumber: 7
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__["Button"], {
    color: "primary",
    component: "a",
    href: "https://devias.io/products/devias-kit-pro",
    variant: "contained",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62,
      columnNumber: 9
    }
  }, "Upgrade")));
};

UpgradePlan.propTypes = {
  className: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.string
};
/* harmony default export */ __webpack_exports__["default"] = (UpgradePlan);

/***/ }),

/***/ "./src/App/layouts/Main/components/Sidebar/components/UpgradePlan/index.js":
/*!*********************************************************************************!*\
  !*** ./src/App/layouts/Main/components/Sidebar/components/UpgradePlan/index.js ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _UpgradePlan__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UpgradePlan */ "./src/App/layouts/Main/components/Sidebar/components/UpgradePlan/UpgradePlan.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _UpgradePlan__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/App/layouts/Main/components/Sidebar/components/index.ts":
/*!*********************************************************************!*\
  !*** ./src/App/layouts/Main/components/Sidebar/components/index.ts ***!
  \*********************************************************************/
/*! exports provided: SidebarFooter, Profile, SidebarNav, UpgradePlan */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SidebarFooter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SidebarFooter */ "./src/App/layouts/Main/components/Sidebar/components/SidebarFooter.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SidebarFooter", function() { return _SidebarFooter__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _Profile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Profile */ "./src/App/layouts/Main/components/Sidebar/components/Profile/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Profile", function() { return _Profile__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _SidebarNav__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SidebarNav */ "./src/App/layouts/Main/components/Sidebar/components/SidebarNav/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SidebarNav", function() { return _SidebarNav__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _UpgradePlan__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./UpgradePlan */ "./src/App/layouts/Main/components/Sidebar/components/UpgradePlan/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UpgradePlan", function() { return _UpgradePlan__WEBPACK_IMPORTED_MODULE_3__["default"]; });






/***/ }),

/***/ "./src/App/layouts/Main/components/Sidebar/index.ts":
/*!**********************************************************!*\
  !*** ./src/App/layouts/Main/components/Sidebar/index.ts ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Sidebar */ "./src/App/layouts/Main/components/Sidebar/Sidebar.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _Sidebar__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/App/layouts/Main/components/Topbar/Topbar.js":
/*!**********************************************************!*\
  !*** ./src/App/layouts/Main/components/Topbar/Topbar.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.m.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _material_ui_styles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @material-ui/styles */ "./node_modules/@material-ui/styles/esm/index.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");
/* harmony import */ var _material_ui_icons_Menu__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @material-ui/icons/Menu */ "./node_modules/@material-ui/icons/Menu.js");
/* harmony import */ var _material_ui_icons_Menu__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_Menu__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _material_ui_icons_NotificationsOutlined__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @material-ui/icons/NotificationsOutlined */ "./node_modules/@material-ui/icons/NotificationsOutlined.js");
/* harmony import */ var _material_ui_icons_NotificationsOutlined__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_NotificationsOutlined__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _material_ui_icons_Input__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @material-ui/icons/Input */ "./node_modules/@material-ui/icons/Input.js");
/* harmony import */ var _material_ui_icons_Input__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_material_ui_icons_Input__WEBPACK_IMPORTED_MODULE_10__);


var _jsxFileName = "/usr/app/src/App/layouts/Main/components/Topbar/Topbar.js";









const useStyles = Object(_material_ui_styles__WEBPACK_IMPORTED_MODULE_6__["makeStyles"])(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const Topbar = props => {
  const className = props.className,
        onSidebarOpen = props.onSidebarOpen,
        rest = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(props, ["className", "onSidebarOpen"]);

  const classes = useStyles();

  const _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])([]),
        _useState2 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 1),
        notifications = _useState2[0];

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["AppBar"], Object.assign({}, rest, {
    className: Object(clsx__WEBPACK_IMPORTED_MODULE_4__["default"])(classes.root, className),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31,
      columnNumber: 5
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Toolbar"], {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35,
      columnNumber: 7
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_3__["Link"], {
    to: "/",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36,
      columnNumber: 9
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("img", {
    alt: "Logo",
    src: "/images/logos/logo--white.svg",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37,
      columnNumber: 11
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
    className: classes.flexGrow,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42,
      columnNumber: 9
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Hidden"], {
    mdDown: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43,
      columnNumber: 9
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["IconButton"], {
    color: "inherit",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44,
      columnNumber: 11
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Badge"], {
    badgeContent: notifications.length,
    color: "primary",
    variant: "dot",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45,
      columnNumber: 13
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_icons_NotificationsOutlined__WEBPACK_IMPORTED_MODULE_9___default.a, {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50,
      columnNumber: 15
    }
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["IconButton"], {
    className: classes.signOutButton,
    color: "inherit",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53,
      columnNumber: 11
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_icons_Input__WEBPACK_IMPORTED_MODULE_10___default.a, {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57,
      columnNumber: 13
    }
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["Hidden"], {
    lgUp: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 60,
      columnNumber: 9
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_7__["IconButton"], {
    color: "inherit",
    onClick: onSidebarOpen,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 61,
      columnNumber: 11
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_material_ui_icons_Menu__WEBPACK_IMPORTED_MODULE_8___default.a, {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 65,
      columnNumber: 13
    }
  })))));
};

Topbar.propTypes = {
  className: prop_types__WEBPACK_IMPORTED_MODULE_5___default.a.string,
  onSidebarOpen: prop_types__WEBPACK_IMPORTED_MODULE_5___default.a.func
};
/* harmony default export */ __webpack_exports__["default"] = (Topbar);

/***/ }),

/***/ "./src/App/layouts/Main/components/Topbar/index.ts":
/*!*********************************************************!*\
  !*** ./src/App/layouts/Main/components/Topbar/index.ts ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Topbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Topbar */ "./src/App/layouts/Main/components/Topbar/Topbar.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _Topbar__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/App/layouts/Main/components/index.ts":
/*!**************************************************!*\
  !*** ./src/App/layouts/Main/components/index.ts ***!
  \**************************************************/
/*! exports provided: Footer, Sidebar, Topbar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Footer */ "./src/App/layouts/Main/components/Footer/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Footer", function() { return _Footer__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Sidebar */ "./src/App/layouts/Main/components/Sidebar/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Sidebar", function() { return _Sidebar__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _Topbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Topbar */ "./src/App/layouts/Main/components/Topbar/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Topbar", function() { return _Topbar__WEBPACK_IMPORTED_MODULE_2__["default"]; });





/***/ }),

/***/ "./src/App/layouts/Main/index.tsx":
/*!****************************************!*\
  !*** ./src/App/layouts/Main/index.tsx ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.m.js");
/* harmony import */ var _material_ui_styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/styles */ "./node_modules/@material-ui/styles/esm/index.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components */ "./src/App/layouts/Main/components/index.ts");

var _jsxFileName = "/usr/app/src/App/layouts/Main/index.tsx";





const useStyles = Object(_material_ui_styles__WEBPACK_IMPORTED_MODULE_3__["makeStyles"])(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%'
  }
}));

const Main = props => {
  const children = props.children;
  const classes = useStyles();
  const theme = Object(_material_ui_styles__WEBPACK_IMPORTED_MODULE_3__["useTheme"])();
  const isDesktop = Object(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__["useMediaQuery"])(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(false),
        _useState2 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
        openSidebar = _useState2[0],
        setOpenSidebar = _useState2[1];

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: Object(clsx__WEBPACK_IMPORTED_MODULE_2__["default"])({
      [classes.root]: true,
      [classes.shiftContent]: isDesktop
    }),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51,
      columnNumber: 3
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components__WEBPACK_IMPORTED_MODULE_5__["Topbar"], {
    onSidebarOpen: handleSidebarOpen,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57,
      columnNumber: 4
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_components__WEBPACK_IMPORTED_MODULE_5__["Sidebar"], {
    onClose: handleSidebarClose,
    open: shouldOpenSidebar,
    variant: isDesktop ? 'persistent' : 'temporary',
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58,
      columnNumber: 4
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("main", {
    className: classes.content,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 63,
      columnNumber: 4
    }
  }, children));
};

/* harmony default export */ __webpack_exports__["default"] = (Main);

/***/ }),

/***/ "./src/App/layouts/Minimal/components/TopBar/index.tsx":
/*!*************************************************************!*\
  !*** ./src/App/layouts/Minimal/components/TopBar/index.tsx ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! clsx */ "./node_modules/clsx/dist/clsx.m.js");
/* harmony import */ var _material_ui_styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/styles */ "./node_modules/@material-ui/styles/esm/index.js");
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");

var _jsxFileName = "/usr/app/src/App/layouts/Minimal/components/TopBar/index.tsx";





const useStyles = Object(_material_ui_styles__WEBPACK_IMPORTED_MODULE_4__["makeStyles"])(() => ({
  root: {
    boxShadow: 'none'
  }
}));

const TopBar = props => {
  const className = props.className,
        rest = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(props, ["className"]);

  const classes = useStyles();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__["AppBar"], Object.assign({}, rest, {
    className: Object(clsx__WEBPACK_IMPORTED_MODULE_3__["default"])(classes.root, className),
    color: "primary",
    position: "fixed",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24,
      columnNumber: 3
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_5__["Toolbar"], {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30,
      columnNumber: 4
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Link"], {
    to: "/",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31,
      columnNumber: 5
    }
  }, "Click Me")));
};

/* harmony default export */ __webpack_exports__["default"] = (TopBar);

/***/ }),

/***/ "./src/App/layouts/Minimal/components/index.ts":
/*!*****************************************************!*\
  !*** ./src/App/layouts/Minimal/components/index.ts ***!
  \*****************************************************/
/*! exports provided: TopBar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TopBar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TopBar */ "./src/App/layouts/Minimal/components/TopBar/index.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TopBar", function() { return _TopBar__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/App/layouts/Minimal/index.tsx":
/*!*******************************************!*\
  !*** ./src/App/layouts/Minimal/index.tsx ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _material_ui_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/styles */ "./node_modules/@material-ui/styles/esm/index.js");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components */ "./src/App/layouts/Minimal/components/index.ts");
var _jsxFileName = "/usr/app/src/App/layouts/Minimal/index.tsx";



const useStyles = Object(_material_ui_styles__WEBPACK_IMPORTED_MODULE_1__["makeStyles"])(() => ({
  root: {
    marginTop: 64,
    height: '100%'
  },
  content: {
    height: 'calc(100vh - 64px)'
  }
}));

const Minimal = props => {
  const children = props.children;
  const classes = useStyles();
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: classes.root,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31,
      columnNumber: 3
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components__WEBPACK_IMPORTED_MODULE_2__["TopBar"], {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32,
      columnNumber: 4
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("main", {
    className: classes.content,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33,
      columnNumber: 4
    }
  }, children));
};

/* harmony default export */ __webpack_exports__["default"] = (Minimal);

/***/ }),

/***/ "./src/App/layouts/index.ts":
/*!**********************************!*\
  !*** ./src/App/layouts/index.ts ***!
  \**********************************/
/*! exports provided: Main, Minimal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Main */ "./src/App/layouts/Main/index.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Main", function() { return _Main__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _Minimal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Minimal */ "./src/App/layouts/Minimal/index.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Minimal", function() { return _Minimal__WEBPACK_IMPORTED_MODULE_1__["default"]; });




/***/ }),

/***/ "./src/FlashMessageHandler.tsx":
/*!*************************************!*\
  !*** ./src/FlashMessageHandler.tsx ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var notistack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! notistack */ "./node_modules/notistack/dist/notistack.esm.js");
/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! query-string */ "./node_modules/query-string/index.js");
/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(query_string__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");





const FlashMessageHandler = props => {
  const _useSnackbar = Object(notistack__WEBPACK_IMPORTED_MODULE_1__["useSnackbar"])(),
        enqueueSnackbar = _useSnackbar.enqueueSnackbar;

  const location = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_3__["useLocation"])();
  const queryValues = query_string__WEBPACK_IMPORTED_MODULE_2___default.a.parse(location.search);
  const flashMessages = [queryValues['user-not-found'] && {
    key: 'user-not-found',
    value: 'User not found',
    variant: 'error'
  }, queryValues['verification-failed'] && {
    key: 'verification-failed',
    value: 'Verification failed',
    variant: 'error'
  }, queryValues['verification-complete'] && {
    key: 'verification-complete',
    value: 'Verification complete',
    variant: 'success'
  }].filter(Boolean);
  flashMessages.forEach(message => enqueueSnackbar(message.value, {
    key: message.key,
    variant: message.variant
  }));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, props.children);
};

/* harmony default export */ __webpack_exports__["default"] = (FlashMessageHandler);

/***/ }),

/***/ "./src/i18n.ts":
/*!*********************!*\
  !*** ./src/i18n.ts ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
/* harmony import */ var i18next_xhr_backend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18next-xhr-backend */ "./node_modules/i18next-xhr-backend/dist/esm/i18nextXHRBackend.js");
/* harmony import */ var i18next_browser_languagedetector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! i18next-browser-languagedetector */ "./node_modules/i18next-browser-languagedetector/dist/esm/i18nextBrowserLanguageDetector.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/index.js");




i18next__WEBPACK_IMPORTED_MODULE_0__["default"].use(i18next_xhr_backend__WEBPACK_IMPORTED_MODULE_1__["default"]).use(i18next_browser_languagedetector__WEBPACK_IMPORTED_MODULE_2__["default"]).use(react_i18next__WEBPACK_IMPORTED_MODULE_3__["initReactI18next"]).init({
  // backend: {
  //   loadPath:
  //     `/locales/{{lng}}/{{ns}}.json`
  // },
  fallbackLng: 'en',
  load: 'languageOnly',
  debug: true
});
/* harmony default export */ __webpack_exports__["default"] = (i18next__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/index.css":
/*!***********************!*\
  !*** ./src/index.css ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-3-1!../node_modules/postcss-loader/src??postcss!./index.css */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./src/index.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-3-1!../node_modules/postcss-loader/src??postcss!./index.css */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./src/index.css", function() {
		var newContent = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-3-1!../node_modules/postcss-loader/src??postcss!./index.css */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./src/index.css");

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/*! exports provided: history, AppStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "history", function() { return history; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppStore", function() { return AppStore; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var history__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! history */ "./node_modules/history/index.js");
/* harmony import */ var notistack__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! notistack */ "./node_modules/notistack/dist/notistack.esm.js");
/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/dist/mobxreact.esm.js");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-i18next */ "./node_modules/react-i18next/dist/es/index.js");
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material-ui/core/styles */ "./node_modules/@material-ui/core/esm/styles/index.js");
/* harmony import */ var _mobx_user__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./mobx/user */ "./src/mobx/user.ts");
/* harmony import */ var _mobx_ui__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./mobx/ui */ "./src/mobx/ui.ts");
/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./theme */ "./src/theme/index.ts");
/* harmony import */ var _i18n__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./i18n */ "./src/i18n.ts");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./index.css */ "./src/index.css");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_index_css__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./App */ "./src/App/index.tsx");
/* harmony import */ var _FlashMessageHandler__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./FlashMessageHandler */ "./src/FlashMessageHandler.tsx");
var _jsxFileName = "/usr/app/src/index.tsx";














 // import * as serviceWorker from './serviceWorker';

const history = Object(history__WEBPACK_IMPORTED_MODULE_3__["createBrowserHistory"])();
const AppStore = {
  UserState: _mobx_user__WEBPACK_IMPORTED_MODULE_8__["default"],
  UiState: _mobx_ui__WEBPACK_IMPORTED_MODULE_9__["default"]
};
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(mobx_react__WEBPACK_IMPORTED_MODULE_5__["Provider"], Object.assign({}, AppStore, {
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 28,
    columnNumber: 2
  }
}), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_7__["MuiThemeProvider"], {
  theme: _theme__WEBPACK_IMPORTED_MODULE_10__["default"],
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 29,
    columnNumber: 3
  }
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(notistack__WEBPACK_IMPORTED_MODULE_4__["SnackbarProvider"], {
  maxSnack: 2,
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'center'
  },
  autoHideDuration: 3000,
  preventDuplicate: true,
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 30,
    columnNumber: 4
  }
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_i18next__WEBPACK_IMPORTED_MODULE_6__["I18nextProvider"], {
  i18n: _i18n__WEBPACK_IMPORTED_MODULE_11__["default"],
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 36,
    columnNumber: 5
  }
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Router"], {
  history: history,
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 37,
    columnNumber: 6
  }
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_FlashMessageHandler__WEBPACK_IMPORTED_MODULE_14__["default"], {
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 38,
    columnNumber: 7
  }
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_App__WEBPACK_IMPORTED_MODULE_13__["default"], {
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 39,
    columnNumber: 8
  }
}))))))), document.getElementById('root')); // If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

/***/ }),

/***/ "./src/mobx/auth.ts":
/*!**************************!*\
  !*** ./src/mobx/auth.ts ***!
  \**************************/
/*! exports provided: Auth, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Auth", function() { return Auth; });
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);



class Auth {
  authenticate(data) {
    return Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
      return _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", axios__WEBPACK_IMPORTED_MODULE_2___default()({
              method: 'post',
              url: '/api/auth/login',
              headers: {
                'Content-Type': 'application/json'
              },
              data,
              withCredentials: true,
              validateStatus: status => {
                return status >= 200 && status < 300 || status === 401; // default
              }
            }).then(req => {
              return req.data;
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  }

  checkIsAuthed() {
    return Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
      return _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", axios__WEBPACK_IMPORTED_MODULE_2___default()({
              method: 'get',
              url: '/api/auth/check-auth',
              headers: {
                'Content-Type': 'application/json'
              },
              validateStatus: status => {
                return status >= 200 && status < 300 || status === 401; // default
              },
              withCredentials: true
            }).then(req => req.data === 'ok').then(result => {
              return result;
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
  }

  getSocialLogInProviders() {
    return Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3() {
      return _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", axios__WEBPACK_IMPORTED_MODULE_2___default()({
              method: 'get',
              url: '/api/auth/providers',
              headers: {
                'Content-Type': 'application/json'
              },
              withCredentials: true
            }).then(req => req.data));

          case 1:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))();
  }

}
/* harmony default export */ __webpack_exports__["default"] = (new Auth());

/***/ }),

/***/ "./src/mobx/ui.ts":
/*!************************!*\
  !*** ./src/mobx/ui.ts ***!
  \************************/
/*! exports provided: UiState, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UiState", function() { return UiState; });
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/initializerDefineProperty */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/initializerDefineProperty.js");
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/applyDecoratedDescriptor */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/applyDecoratedDescriptor.js");
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerWarningHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/initializerWarningHelper */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/initializerWarningHelper.js");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx */ "./node_modules/mobx/lib/mobx.module.js");
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/src/js.cookie.js");
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(js_cookie__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./auth */ "./src/mobx/auth.ts");




var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp;




let UiState = (_class = (_temp = class UiState {
  // Social LogIn
  constructor() {
    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "isAuthenticated", _descriptor, this);

    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "locale", _descriptor2, this);

    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "pendingRequestCount", _descriptor3, this);

    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "globalLoading", _descriptor4, this);

    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "socialLogInProvidersLoading", _descriptor5, this);

    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "socialLogInProviders", _descriptor6, this);

    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "setSocialLogInProviders", _descriptor7, this);

    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "setAuthenticated", _descriptor8, this);

    _auth__WEBPACK_IMPORTED_MODULE_5__["default"].checkIsAuthed().then(isAuthed => {
      this.setAuthenticated(isAuthed);
    });
    _auth__WEBPACK_IMPORTED_MODULE_5__["default"].getSocialLogInProviders().then(providers => {
      this.setSocialLogInProviders(providers);
    });
  }

}, _temp), (_descriptor = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "isAuthenticated", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return !!js_cookie__WEBPACK_IMPORTED_MODULE_4___default.a.get('userid');
  }
}), _descriptor2 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "locale", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 'en_US';
  }
}), _descriptor3 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "pendingRequestCount", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return 0;
  }
}), _descriptor4 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "globalLoading", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), _descriptor5 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "socialLogInProvidersLoading", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return true;
  }
}), _descriptor6 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "socialLogInProviders", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor7 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "setSocialLogInProviders", [mobx__WEBPACK_IMPORTED_MODULE_3__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return providers => {
      this.socialLogInProviders = providers;
      this.socialLogInProvidersLoading = false;
    };
  }
}), _descriptor8 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "setAuthenticated", [mobx__WEBPACK_IMPORTED_MODULE_3__["action"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return val => {
      this.isAuthenticated = val;
    };
  }
})), _class);
const uiState = new UiState();
/* harmony default export */ __webpack_exports__["default"] = (uiState);

/***/ }),

/***/ "./src/mobx/user.ts":
/*!**************************!*\
  !*** ./src/mobx/user.ts ***!
  \**************************/
/*! exports provided: UserState, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserState", function() { return UserState; });
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/initializerDefineProperty */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/initializerDefineProperty.js");
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/applyDecoratedDescriptor */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/applyDecoratedDescriptor.js");
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerWarningHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/initializerWarningHelper */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/initializerWarningHelper.js");
/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mobx */ "./node_modules/mobx/lib/mobx.module.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ui */ "./src/mobx/ui.ts");




var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;




let UserState = (_class = (_temp = class UserState {
  constructor(_user) {
    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "id", _descriptor, this);

    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "email", _descriptor2, this);

    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "emailVerified", _descriptor3, this);

    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "sendEmail", _descriptor4, this);

    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "name", _descriptor5, this);

    Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_initializerDefineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "loading", _descriptor6, this);

    this.setUserData = user => {
      this.id = user.id;
      this.email = user.email;
      this.emailVerified = user.emailVerified;
      this.sendEmail = user.sendEmail;
      this.name = user.name;
    };

    this.fetchUserData = () => axios__WEBPACK_IMPORTED_MODULE_4___default()({
      method: 'get',
      url: '/api/user',
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }).catch(e => {
      if (e.response.status === 401) {
        _ui__WEBPACK_IMPORTED_MODULE_5__["default"].setAuthenticated(false);
        return e;
      }

      throw e;
    });

    if (_user) {
      this.setUserData(_user);
    } else {
      this.pullUser();
    }
  }

  pullUser() {
    this.loading = true;
    return this.fetchUserData().then(Object(mobx__WEBPACK_IMPORTED_MODULE_3__["action"])(res => {
      if (res.data) {
        this.setUserData(res.data);
      }
    })).finally(Object(mobx__WEBPACK_IMPORTED_MODULE_3__["action"])(() => {
      this.loading = false;
    }));
  }

}, _temp), (_descriptor = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "id", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "email", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "emailVerified", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "sendEmail", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "name", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "loading", [mobx__WEBPACK_IMPORTED_MODULE_3__["observable"]], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return false;
  }
}), Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_1__["default"])(_class.prototype, "pullUser", [mobx__WEBPACK_IMPORTED_MODULE_3__["action"]], Object.getOwnPropertyDescriptor(_class.prototype, "pullUser"), _class.prototype)), _class);
/* harmony default export */ __webpack_exports__["default"] = (new UserState());

/***/ }),

/***/ "./src/theme/index.ts":
/*!****************************!*\
  !*** ./src/theme/index.ts ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material-ui/core/styles */ "./node_modules/@material-ui/core/esm/styles/index.js");
/* harmony import */ var _palette__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./palette */ "./src/theme/palette.ts");
/* harmony import */ var _typography__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./typography */ "./src/theme/typography.ts");
/* harmony import */ var _overrides__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./overrides */ "./src/theme/overrides/index.ts");




const theme = Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_0__["createMuiTheme"])({
  palette: _palette__WEBPACK_IMPORTED_MODULE_1__["default"],
  typography: _typography__WEBPACK_IMPORTED_MODULE_2__["default"],
  overrides: _overrides__WEBPACK_IMPORTED_MODULE_3__["default"],
  zIndex: {
    appBar: 1200,
    drawer: 1100
  }
});
/* harmony default export */ __webpack_exports__["default"] = (theme);

/***/ }),

/***/ "./src/theme/overrides/MuiButton.ts":
/*!******************************************!*\
  !*** ./src/theme/overrides/MuiButton.ts ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  contained: {
    boxShadow: '0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.20)',
    backgroundColor: '#FFFFFF'
  }
});

/***/ }),

/***/ "./src/theme/overrides/MuiIconButton.ts":
/*!**********************************************!*\
  !*** ./src/theme/overrides/MuiIconButton.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _palette__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../palette */ "./src/theme/palette.ts");

/* harmony default export */ __webpack_exports__["default"] = ({
  root: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].icon,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)'
    }
  }
});

/***/ }),

/***/ "./src/theme/overrides/MuiPaper.ts":
/*!*****************************************!*\
  !*** ./src/theme/overrides/MuiPaper.ts ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  elevation1: {
    boxShadow: '0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15)'
  }
});

/***/ }),

/***/ "./src/theme/overrides/MuiTableCell.ts":
/*!*********************************************!*\
  !*** ./src/theme/overrides/MuiTableCell.ts ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _palette__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../palette */ "./src/theme/palette.ts");
/* harmony import */ var _typography__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../typography */ "./src/theme/typography.ts");



/* harmony default export */ __webpack_exports__["default"] = ({
  root: Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_usr_app_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _typography__WEBPACK_IMPORTED_MODULE_2__["default"].body1), {}, {
    borderBottom: "1px solid ".concat(_palette__WEBPACK_IMPORTED_MODULE_1__["default"].divider)
  })
});

/***/ }),

/***/ "./src/theme/overrides/MuiTableHead.ts":
/*!*********************************************!*\
  !*** ./src/theme/overrides/MuiTableHead.ts ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");

/* harmony default export */ __webpack_exports__["default"] = ({
  root: {
    backgroundColor: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].grey[50]
  }
});

/***/ }),

/***/ "./src/theme/overrides/MuiTypography.ts":
/*!**********************************************!*\
  !*** ./src/theme/overrides/MuiTypography.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  gutterBottom: {
    marginBottom: 8
  }
});

/***/ }),

/***/ "./src/theme/overrides/index.ts":
/*!**************************************!*\
  !*** ./src/theme/overrides/index.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MuiButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MuiButton */ "./src/theme/overrides/MuiButton.ts");
/* harmony import */ var _MuiIconButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MuiIconButton */ "./src/theme/overrides/MuiIconButton.ts");
/* harmony import */ var _MuiPaper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MuiPaper */ "./src/theme/overrides/MuiPaper.ts");
/* harmony import */ var _MuiTableCell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MuiTableCell */ "./src/theme/overrides/MuiTableCell.ts");
/* harmony import */ var _MuiTableHead__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MuiTableHead */ "./src/theme/overrides/MuiTableHead.ts");
/* harmony import */ var _MuiTypography__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./MuiTypography */ "./src/theme/overrides/MuiTypography.ts");






/* harmony default export */ __webpack_exports__["default"] = ({
  MuiButton: _MuiButton__WEBPACK_IMPORTED_MODULE_0__["default"],
  MuiIconButton: _MuiIconButton__WEBPACK_IMPORTED_MODULE_1__["default"],
  MuiPaper: _MuiPaper__WEBPACK_IMPORTED_MODULE_2__["default"],
  MuiTableCell: _MuiTableCell__WEBPACK_IMPORTED_MODULE_3__["default"],
  MuiTableHead: _MuiTableHead__WEBPACK_IMPORTED_MODULE_4__["default"],
  MuiTypography: _MuiTypography__WEBPACK_IMPORTED_MODULE_5__["default"]
});

/***/ }),

/***/ "./src/theme/palette.ts":
/*!******************************!*\
  !*** ./src/theme/palette.ts ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material-ui/core */ "./node_modules/@material-ui/core/esm/index.js");

const white = '#FFFFFF';
const black = '#000000';
/* harmony default export */ __webpack_exports__["default"] = ({
  black,
  white,
  primary: {
    contrastText: white,
    dark: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].indigo[900],
    main: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].indigo[500],
    light: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].indigo[100]
  },
  secondary: {
    contrastText: white,
    dark: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].blue[900],
    main: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].blue['A400'],
    light: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].blue['A400']
  },
  success: {
    contrastText: white,
    dark: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].green[900],
    main: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].green[600],
    light: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].green[400]
  },
  info: {
    contrastText: white,
    dark: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].blue[900],
    main: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].blue[600],
    light: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].blue[400]
  },
  warning: {
    contrastText: white,
    dark: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].orange[900],
    main: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].orange[600],
    light: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].orange[400]
  },
  error: {
    contrastText: white,
    dark: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].red[900],
    main: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].red[600],
    light: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].red[400]
  },
  text: {
    primary: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].blueGrey[900],
    secondary: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].blueGrey[600],
    link: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].blue[600]
  },
  background: {
    default: '#F4F6F8',
    paper: white
  },
  icon: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].blueGrey[600],
  divider: _material_ui_core__WEBPACK_IMPORTED_MODULE_0__["colors"].grey[200]
});

/***/ }),

/***/ "./src/theme/typography.ts":
/*!*********************************!*\
  !*** ./src/theme/typography.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _palette__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./palette */ "./src/theme/palette.ts");

/* harmony default export */ __webpack_exports__["default"] = ({
  h1: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].text.primary,
    fontWeight: 500,
    fontSize: '35px',
    letterSpacing: '-0.24px',
    lineHeight: '40px'
  },
  h2: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].text.primary,
    fontWeight: 500,
    fontSize: '29px',
    letterSpacing: '-0.24px',
    lineHeight: '32px'
  },
  h3: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].text.primary,
    fontWeight: 500,
    fontSize: '24px',
    letterSpacing: '-0.06px',
    lineHeight: '28px'
  },
  h4: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].text.primary,
    fontWeight: 500,
    fontSize: '20px',
    letterSpacing: '-0.06px',
    lineHeight: '24px'
  },
  h5: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].text.primary,
    fontWeight: 500,
    fontSize: '16px',
    letterSpacing: '-0.05px',
    lineHeight: '20px'
  },
  h6: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].text.primary,
    fontWeight: 500,
    fontSize: '14px',
    letterSpacing: '-0.05px',
    lineHeight: '20px'
  },
  subtitle1: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].text.primary,
    fontSize: '16px',
    letterSpacing: '-0.05px',
    lineHeight: '25px'
  },
  subtitle2: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].text.secondary,
    fontWeight: 400,
    fontSize: '14px',
    letterSpacing: '-0.05px',
    lineHeight: '21px'
  },
  body1: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].text.primary,
    fontSize: '14px',
    letterSpacing: '-0.05px',
    lineHeight: '21px'
  },
  body2: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].text.secondary,
    fontSize: '12px',
    letterSpacing: '-0.04px',
    lineHeight: '18px'
  },
  button: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].text.primary,
    fontSize: '14px'
  },
  caption: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].text.secondary,
    fontSize: '11px',
    letterSpacing: '0.33px',
    lineHeight: '13px'
  },
  overline: {
    color: _palette__WEBPACK_IMPORTED_MODULE_0__["default"].text.secondary,
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.33px',
    lineHeight: '13px',
    textTransform: 'uppercase'
  }
});

/***/ }),

/***/ 1:
/*!***************************************************************************************************************!*\
  !*** multi (webpack)/hot/dev-server.js ./node_modules/react-dev-utils/webpackHotDevClient.js ./src/index.tsx ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /usr/app/node_modules/webpack/hot/dev-server.js */"./node_modules/webpack/hot/dev-server.js");
__webpack_require__(/*! /usr/app/node_modules/react-dev-utils/webpackHotDevClient.js */"./node_modules/react-dev-utils/webpackHotDevClient.js");
module.exports = __webpack_require__(/*! /usr/app/src/index.tsx */"./src/index.tsx");


/***/ })

},[[1,"runtime-main",0]]]);
//# sourceMappingURL=main.chunk.js.map