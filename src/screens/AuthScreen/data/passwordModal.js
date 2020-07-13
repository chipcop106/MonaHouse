import * as Yup from 'yup'

export class PasswordData {

    constructor(password, confirmPassword) {

    }

    static empty(){
        return new PasswordData('', '');
    }
}
export const PasswordSchema = Yup.object().shape({
    // email: Yup.string().email('Invalid email'),
    password: Yup.string().required('Phải nhập mật khẩu').min(4, 'mật khẩu phải ít nhất 4 ký tự'),
    confirmPassword: Yup.string().required('Phải nhập mật khẩu xác nhận').min(4, 'Mật khẩu phải ít nhất 4 ký tự').oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
});