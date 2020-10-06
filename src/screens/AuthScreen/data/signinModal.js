import * as Yup from 'yup'

export class SignInData {

    constructor(email, password) {

    }

}
export const SignInSchema = Yup.object().shape({
    // email: Yup.string().email('Invalid email'),
    username: Yup.string().required('Phải nhập tên dăng nhập').min(4, 'Tên dăng nhập phải ít nhất 4 ký tự'),
    password: Yup.string().required('Phải nhập mật khẩu').min(4, 'Mật khẩu phải ít nhất 4 ký tự'),
});