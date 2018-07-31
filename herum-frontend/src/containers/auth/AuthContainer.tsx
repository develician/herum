import * as React from 'react';
import { connect } from 'react-redux';
import { baseActions } from 'store/modules/base';
import { authActions, Input } from 'store/modules/auth';
import { userActions } from 'store/modules/user';
import { bindActionCreators } from 'redux';
import { State } from 'store/modules';
import { withRouter } from 'react-router-dom';
import AuthWrapper from 'components/auth/AuthWrapper';
import AuthContent from 'components/auth/AuthContent';
import PageTemplate from 'components/base/PageTemplate';
import InputWithLabel from 'components/auth/InputWithLabel';
import AuthButton from 'components/auth/AuthButton';
import RightAlignedLink from 'components/auth/RightAlignedLink';
import { isEmail, isLength, isAlphanumeric } from 'validator';
import AuthError from 'components/auth/AuthError';
import debounce from 'lodash/debounce';
import storage from 'lib/storage';
import queryString from 'query-string';

export interface AuthContainerProps {
  BaseActions: typeof baseActions;
  AuthActions: typeof authActions;
  UserActions: typeof userActions;
  match: any;
  input: Input;
  loginError: string;
  registerError: string;
  existsUsername: boolean;
  existsEmail: boolean;
  result: any;
  history: any;
  location: any;
}

class AuthContainer extends React.Component<AuthContainerProps> {
  public validate = {
    email: (value: string, form: string) => {
      if (!isEmail(value)) {
        this.handleSetError('잘못된 이메일 형식입니다.', form);
        return false;
      }
      return true;
    },
    username: (value: string, form: string) => {
      if (!isAlphanumeric(value) || !isLength(value, { min: 4, max: 15 })) {
        this.handleSetError('아이디는 4~15 글자의 알파벳 혹은 숫자로 이뤄져야 합니다.', form);
        return false;
      }
      return true;
    },
    password: (value: string, form: string) => {
      if (!isLength(value, { min: 6 })) {
        this.handleSetError('비밀번호를 6자 이상 입력하세요.', form);
        return false;
      }
      this.handleSetError('', form);
      return true;
    },
    passwordConfirm: (value: string, form: string) => {
      if (this.props.input.password !== value) {
        this.handleSetError('비밀번호확인이 일치하지 않습니다.', form);
        return false;
      }
      this.handleSetError('', form);
      return true;
    },
  };

  public handleCheckEmailExists = debounce(async (email: string) => {
    const { AuthActions } = this.props;
    try {
      await AuthActions.checkEmailExists(email);
      if (this.props.existsEmail) {
        this.handleSetError('이미 존재하는 이메일 입니다.', 'register');
      } else {
        this.handleSetError('', 'register');
      }
    } catch (e) {
      console.log(e);
    }
  }, 300);

  public handleCheckUsernameExists = debounce(async (username: string) => {
    const { AuthActions } = this.props;

    try {
      await AuthActions.checkUsernameExists(username);
      if (this.props.existsUsername) {
        this.handleSetError('이미 존재하는 아이디입니다.', 'register');
      } else {
        this.handleSetError('', 'register');
      }
    } catch (e) {
      console.log(e);
    }
  }, 300);

  public componentDidMount() {
    const { location } = this.props;
    const query = queryString.parse(location.search);

    if (query.expired !== undefined) {
      this.handleSetError('세션에 만료되었습니다. 다시 로그인하세요.', 'login');
    }
  }

  public componentDidUpdate(prevProps: AuthContainerProps) {
    if (prevProps.match.params.category !== this.props.match.params.category) {
      this.props.AuthActions.initializeForm();
    }
  }

  public componentWillMount() {
    const { BaseActions } = this.props;
    BaseActions.setHeaderVisibility(false);
  }

  public componentWillUnmount() {
    const { BaseActions } = this.props;
    BaseActions.setHeaderVisibility(true);
  }

  public handleChangeInputRegister = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { AuthActions } = this.props;

    AuthActions.changeInput({ name: e.target.name, value: e.target.value });

    const validation = this.validate[e.target.name](e.target.value, 'register');
    if (!validation || e.target.name.indexOf('password') > -1) {
      return;
    }

    const check =
      e.target.name === 'email' ? this.handleCheckEmailExists : this.handleCheckUsernameExists;
    check(e.target.value);
  };

  public handleChangeInputLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { AuthActions } = this.props;

    AuthActions.changeInput({ name: e.target.name, value: e.target.value });

    // const validation = this.validate[e.target.name](e.target.value, 'login');
    // if (!validation || e.target.name.indexOf('password') > -1) {
    //   return;
    // }
  };

  public handleSetError = (message: string, form: string) => {
    const { AuthActions } = this.props;
    AuthActions.setError({
      message,
      form,
    });
  };

  public handleLocalLogin = async () => {
    const { AuthActions, UserActions } = this.props;
    const { email, password } = this.props.input;
    try {
      await AuthActions.localLogin({ email, password });
      const loggedInfo = this.props.result;

      UserActions.setLoggedInfo(loggedInfo);
      this.props.history.push('/');
      storage.set('loggedInfo', loggedInfo);
    } catch (e) {
      console.log('a');
      this.handleSetError('잘못된 계정정보입니다.', 'login');
    }
  };

  public handleLoginKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.handleLocalLogin();
    }
  };

  public handleLocalRegister = async () => {
    const { AuthActions, registerError, UserActions } = this.props;
    const { email, username, password, passwordConfirm } = this.props.input;
    if (registerError) {
      return;
    }
    if (
      !this.validate.email(email, 'register') ||
      !this.validate.username(username, 'register') ||
      !this.validate.password(password, 'register') ||
      !this.validate.passwordConfirm(passwordConfirm, 'register')
    ) {
      return;
    }

    try {
      await AuthActions.localRegister({ email, username, password });
      const loggedInfo = this.props.result;
      storage.set('loggedInfo', loggedInfo);

      UserActions.setLoggedInfo(loggedInfo);
      UserActions.setValidated(true);

      this.props.history.push('/');
    } catch (e) {
      if (e.response.status === 409) {
        const { key } = e.response.data;
        const message =
          key === 'email' ? '이미 존재하는 이메일입니다.' : '이미 존재하는 아이디입니다.';
        return this.handleSetError(message, 'register');
      }
      this.handleSetError('알수 없는 오류가 발생했습니다.', 'register');
    }
  };

  public render() {
    const { category } = this.props.match.params;
    const { email, username, password, passwordConfirm } = this.props.input;
    if (category === 'register') {
      return (
        <PageTemplate>
          <AuthWrapper>
            <AuthContent title="회원가입">
              <InputWithLabel
                label="이메일"
                name="email"
                placeholder="이메일"
                value={email}
                onChange={this.handleChangeInputRegister}
              />
              <InputWithLabel
                label="아이디"
                name="username"
                placeholder="아이디"
                value={username}
                onChange={this.handleChangeInputRegister}
              />
              <InputWithLabel
                label="비밀번호"
                name="password"
                placeholder="비밀번호"
                type="password"
                value={password}
                onChange={this.handleChangeInputRegister}
              />
              <InputWithLabel
                label="비밀번호 확인"
                name="passwordConfirm"
                placeholder="비밀번호 확인"
                type="password"
                value={passwordConfirm}
                onChange={this.handleChangeInputRegister}
              />
              {this.props.registerError && <AuthError>{this.props.registerError}</AuthError>}
              <AuthButton onClick={this.handleLocalRegister}>회원가입</AuthButton>
              <RightAlignedLink to={'/auth/login'}>로그인</RightAlignedLink>
            </AuthContent>
          </AuthWrapper>
        </PageTemplate>
      );
    }
    return (
      <PageTemplate>
        <AuthWrapper>
          <AuthContent title="로그인">
            <InputWithLabel
              label="이메일"
              name="email"
              placeholder="이메일"
              value={email}
              onChange={this.handleChangeInputLogin}
            />
            <InputWithLabel
              label="비밀번호"
              name="password"
              placeholder="비밀번호"
              type="password"
              value={password}
              onChange={this.handleChangeInputLogin}
              onKeyPress={this.handleLoginKeyPress}
            />
            {this.props.loginError && <AuthError>{this.props.loginError}</AuthError>}
            <AuthButton onClick={this.handleLocalLogin}>로그인</AuthButton>
            <RightAlignedLink to={'/auth/register'}>회원가입</RightAlignedLink>
          </AuthContent>
        </AuthWrapper>
      </PageTemplate>
    );
  }
}

export default connect(
  ({ auth }: State) => ({
    input: auth.input,
    registerError: auth.register.error,
    loginError: auth.login.error,
    existsUsername: auth.exists.username,
    existsEmail: auth.exists.email,
    result: auth.result,
  }),
  dispatch => ({
    BaseActions: bindActionCreators(baseActions, dispatch),
    AuthActions: bindActionCreators(authActions, dispatch),
    UserActions: bindActionCreators(userActions, dispatch),
  })
)(withRouter(AuthContainer as any));
