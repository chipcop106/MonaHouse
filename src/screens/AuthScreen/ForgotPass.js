import React, { useState } from 'react';
import {
	Text,
	StyleSheet,
	View,
	KeyboardAvoidingView,
	ActivityIndicator,
	Alert,
} from 'react-native';
import {
	ScrollView,
	TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { Formik } from 'formik';
import { Button, Input, Icon } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PasswordData, PasswordSchema } from './data/passwordModal';
import { InputValidate } from '~/components/common/InputValidate';
import { resetPassword } from '~/api/AccountAPI';
const LoadingIndicator = () => <ActivityIndicator color="#fff" />;
const ForgotPass = () => {
	const [loading, setLoading] = useState(false);
	const navigation = useNavigation();
	const route = useRoute();

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: <Text style={styles.header}>{`Đặt lại mật khẩu`}</Text>,
		});
	}, [navigation, route]);

	const _onFormSubmit = async (values) => {
		setLoading(true);
		try {
			const res = await resetPassword({ newpass: values.password });
			if (res.Code === 1) {
				Alert.alert('Chúc mừng', 'Mật khẩu mới đã được cập nhật');
				navigation.pop();
			} else {
				Alert.alert(
					'Thất bại!',
					'Có lỗi xãy ra trong quá trình cập nhật, vui lòng liên hệ nhà cung cấp để lấy lại mật khẩu'
				);
			}
		} catch (error) {
			console.log('Submit resetPassword error', error);
			Alert.alert(
				'Thất bại!',
				'Có lỗi xãy ra trong quá trình cập nhật, vui lòng liên hệ nhà cung cấp để lấy lại mật khẩu'
			);
		}
		setLoading(false);
	};
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : null}
			style={{ flex: 1 }}>
			<ScrollView
				contentContainerStyle={[{ padding: 15 }]}
				removeClippedSubviews={false}>
				<Formik
					initialValues={PasswordData.empty()}
					validationSchema={PasswordSchema}
					onSubmit={_onFormSubmit}>
					{({ handleSubmit }) => (
						<View style={styles.formContainer}>
							<View style={styles.formGroup}>
								<InputValidate
									returnKeyType={'done'}
									secureTextEntry={true}
									label={(txtprops) => (
										<Text {...txtprops} style={styles.label}>
											Mật khẩu:
										</Text>
									)}
									id="password"
									// value={password}
									// onChangeText={(value) => setPassword(value)}
									style={styles.input}
									autoCorrect={false}
									autoCapitalize={'none'}
									editable={!loading}
								/>
							</View>
							<View style={styles.formGroup}>
								<InputValidate
									secureTextEntry={true}
									label={(txtprops) => (
										<Text {...txtprops} style={styles.label}>
											Xác nhận mật khẩu:
										</Text>
									)}
									id="confirmPassword"
									// value={password}
									// onChangeText={(value) => setPassword(value)}
									style={styles.input}
									autoCorrect={false}
									autoCapitalize={'none'}
									editable={!loading}
								/>
							</View>
							<Button
								style={styles.btnLogin}
								onPress={handleSubmit}
								accessoryRight={loading ? LoadingIndicator : null}>
								{' '}
								{loading ? `ĐANG XỬ LÝ` : `XÁC NHẬN`}{' '}
							</Button>
						</View>
					)}
				</Formik>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	pageWrap: {
		padding: 15,
		flex: 1,
	},
	header: {
		textAlign: 'center',
		marginTop: 60,
		fontSize: 22,
		margin: 20,
		color: '#fff',
	},
	label: {
		marginBottom: 5,
		fontWeight: 'normal',
		fontSize: 15,
	},
	formContainer: {
		padding: 20,
		backgroundColor: '#fff',
		borderRadius: 15,
	},
	formGroup: {
		marginBottom: 15,
	},
});

export default ForgotPass;
