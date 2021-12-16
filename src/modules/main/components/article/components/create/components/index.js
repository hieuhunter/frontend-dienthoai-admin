import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import httpRequest from 'common/utils/httpRequest';
import Card from 'common/components/Card/components';
import Breadcrumb from 'common/components/Breadcrumb/components';
import history from 'common/utils/history';
import classNames from 'classnames';
import ImageInput from 'common/components/ImageInput/components';
import MarkDownEditor from 'common/components/MarkDownEditor/components';
import AsyncCreatableSelect from 'react-select/async-creatable';
import AsyncSelect from 'react-select/async';
import { useSelector } from 'react-redux';
import { getCookie } from 'common/utils/cookies';

const CreateArticleComponent = () => {
	const auth = useSelector((state) => state.appAuth.current);

	const promiseBrands = (q) => {
		return httpRequest
			.get({
				url: `/brand`,
				token: auth.token.access_token
			})
			.then((response) => {
				if (!response.data.success) {
					console.log('Error');
					return [];
				}
				return response.data.data;
			})
			.catch((error) => {
				console.log(error);
				return [];
			})
			.finally(() => {});
	};

	const promiseCategories = (q) => {
		return httpRequest
			.get({
				url: `/category`,
				token: auth.token.access_token
			})
			.then((response) => {
				if (!response.data.success) {
					console.log('Error');
					return [];
				}
				return response.data.data;
			})
			.catch((error) => {
				console.log(error);
				return [];
			})
			.finally(() => {});
	};

	const formik = useFormik({
		initialValues: {
			ten_sp: '',
			gia_goc: '',
			gia: '',
			category: '',
			brand: '',
			so_luong: '',
			thong_tin_man_hinh: '',
			cpu: '',
			ram: '',
			camera_sau: '',
			camera_truoc: '',
			bo_nho_trong: '',
			the_nho_ngoai: '',
			pin: '',
			he_dieu_hanh: '',
			kha_dung: 1,
			hinh: null
		},

		validationSchema: Yup.object({
			hinh: Yup.mixed()
				.required('Image is required')
				.test(
					'fileSize',
					'Image size too large, max image size is 2 MB',
					(value) => value === null || (value && value.size <= 2048 * 1024)
				)
				.test(
					'fileFormat',
					'Unsupported image format',
					(value) => value === null || (value && ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'].includes(value.type))
				),
			ten_sp: Yup.string().required('name_product is required').max(166, 'name_product is maximum 166 characters'),
			thong_tin_man_hinh: Yup.string()
				.required('thong_tin_man_hinh is required')
				.max(166, 'thong_tin_man_hinh is maximum 166 characters'),
			so_luong: Yup.number().integer('Invaild so_luong').required('so_luong is required'),

			category: Yup.object().required('Select category'),
			brand: Yup.object().required('Select brand'),

			gia: Yup.number().integer('Invaild gia').required('gia is required'),
			gia_goc: Yup.number().integer('Invaild gia').required('gia_goc is required'),
			cpu: Yup.string().required('name_product is required').max(166, 'name_product is maximum 166 characters'),
			ram: Yup.string().required('name_product is required').max(166, 'name_product is maximum 166 characters'),
			camera_sau: Yup.string().required('name_product is required').max(166, 'name_product is maximum 166 characters'),
			camera_truoc: Yup.string().required('name_product is required').max(166, 'name_product is maximum 166 characters'),
			bo_nho_trong: Yup.string().required('name_product is required').max(166, 'name_product is maximum 166 characters'),
			the_nho_ngoai: Yup.string().required('name_product is required').max(166, 'name_product is maximum 166 characters'),
			pin: Yup.string().required('name_product is required').max(166, 'name_product is maximum 166 characters'),
			he_dieu_hanh: Yup.string().required('name_product is required').max(166, 'name_product is maximum 166 characters')
		}),
		onSubmit: (values, { setSubmitting, setErrors }) => {
			console.log(values);
			httpRequest
				.formDataPost({
					url: `/newproducts`,
					token: getCookie('token'),
					data: {
						ten_sp: values.ten_sp,
						thong_tin_man_hinh: values.thong_tin_man_hinh,
						category: JSON.stringify(values.category),
						brand: JSON.stringify(values.brand),
						gia: values.gia,
						gia_goc: values.gia_goc,
						so_luong: values.so_luong,
						cpu: values.cpu,
						ram: values.ram,
						camera_sau: values.camera_sau,
						camera_truoc: values.camera_truoc,
						bo_nho_trong: values.bo_nho_trong,
						the_nho_ngoai: values.the_nho_ngoai,
						pin: values.pin,
						he_dieu_hanh: values.he_dieu_hanh,
						kha_dung: values.kha_dung
					},
					files: {
						hinh: values.hinh
					}
				})
				.then((response) => {
					if (!response.data.success) {
						console.log('Error');
					}
					history.push(`/main/articles`);
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {
					setSubmitting(false);
				});
		}
	});

	/* const onKeyDown = (keyEvent) => {
		if (keyEvent.code === 'Enter' || keyEvent.code === 'NumpadEnter') {
			keyEvent.preventDefault();
		}
	}; */

	return (
		<>
			<div className="content-header py-3">
				<Breadcrumb>Thêm sản phẩm</Breadcrumb>
			</div>
			<div className="content-body">
				<Card header="Create article">
					<form onSubmit={formik.handleSubmit} className="row g-3">
						<div className="col-md-12">
							<label htmlFor="hinh" className="form-label">
								Hình <span className="text-danger">*</span>
							</label>
							<ImageInput name="hinh" id="hinh" onChange={formik.setFieldValue} onBlur={formik.setFieldTouched} />
							{formik.errors.hinh && formik.touched.hinh && <div className="invalid-feedback d-block">{formik.errors.hinh}</div>}
						</div>
						<div className="col-md-6">
							<label htmlFor="tensp" className="form-label">
								Tên sản phẩm <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								placeholder="Tên sản phẩm"
								className={classNames('form-control', {
									'is-invalid': formik.errors.ten_sp && formik.touched.ten_sp
								})}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.ten_sp}
								name="ten_sp"
								id="ten_sp"
							/>
							{formik.errors.ten_sp && formik.touched.ten_sp && <div className="invalid-feedback">{formik.errors.ten_sp}</div>}
						</div>
						<div className="col-md-6">
							<label htmlFor="slug" className="form-label">
								Thông tin màn hình
							</label>
							<input
								type="text"
								placeholder="Thông tin màn hình"
								className={classNames('form-control', {
									'is-invalid': formik.errors.thong_tin_man_hinh && formik.touched.thong_tin_man_hinh
								})}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.thong_tin_man_hinh}
								name="thong_tin_man_hinh"
								id="thong_tin_man_hinh"
							/>
							{formik.errors.thong_tin_man_hinh && formik.touched.thong_tin_man_hinh && (
								<div className="invalid-feedback">{formik.errors.thong_tin_man_hinh}</div>
							)}
						</div>
						<div className="col-md-6">
							<label htmlFor="title" className="form-label">
								Gía <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								placeholder="Giá"
								className={classNames('form-control', {
									'is-invalid': formik.errors.gia && formik.touched.gia
								})}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.gia}
								name="gia"
								id="gia"
							/>
							{formik.errors.gia && formik.touched.gia && <div className="invalid-feedback">{formik.errors.gia}</div>}
						</div>
						<div className="col-md-6">
							<label htmlFor="gia_goc" className="form-label">
								Gia goc <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								placeholder="Giá gốc"
								className={classNames('form-control', {
									'is-invalid': formik.errors.gia_goc && formik.touched.gia_goc
								})}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.gia_goc}
								name="gia_goc"
								id="gia_goc"
							/>
							{formik.errors.gia_goc && formik.touched.gia_goc && <div className="invalid-feedback">{formik.errors.gia_goc}</div>}
						</div>
						<div className="col-md-6">
							<label htmlFor="soluong" className="form-label">
								Số lượng
							</label>
							<input
								type="text"
								placeholder="Số lượng"
								className={classNames('form-control', {
									'is-invalid': formik.errors.so_luong && formik.touched.so_luong
								})}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.so_luong}
								name="so_luong"
								id="so_luong"
							/>
							{formik.errors.so_luong && formik.touched.so_luong && (
								<div className="invalid-feedback">{formik.errors.so_luong}</div>
							)}
						</div>
						<div className="col-md-6">
							<label htmlFor="title" className="form-label">
								CPU <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								placeholder="Cpu"
								className={classNames('form-control', {
									'is-invalid': formik.errors.cpu && formik.touched.cpu
								})}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.cpu}
								name="cpu"
								id="cpu"
							/>
							{formik.errors.cpu && formik.touched.cpu && <div className="invalid-feedback">{formik.errors.cpu}</div>}
						</div>
						<div className="col-md-6">
							<label htmlFor="ram" className="form-label">
								Ram
							</label>
							<input
								type="text"
								placeholder="Ram"
								className={classNames('form-control', {
									'is-invalid': formik.errors.ram && formik.touched.ram
								})}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.ram}
								name="ram"
								id="ram"
							/>
							{formik.errors.ram && formik.touched.ram && <div className="invalid-feedback">{formik.errors.ram}</div>}
						</div>
						<div className="col-md-6">
							<label htmlFor="title" className="form-label">
								Camera sau <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								placeholder="Camera sau"
								className={classNames('form-control', {
									'is-invalid': formik.errors.camera_sau && formik.touched.camera_sau
								})}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.camera_sau}
								name="camera_sau"
								id="camera_sau"
							/>
							{formik.errors.camera_sau && formik.touched.camera_sau && (
								<div className="invalid-feedback">{formik.errors.camera_sau}</div>
							)}
						</div>
						<div className="col-md-6">
							<label htmlFor="cameratruoc" className="form-label">
								Camera trước
							</label>
							<input
								type="text"
								placeholder="Camera trước"
								className={classNames('form-control', {
									'is-invalid': formik.errors.camera_truoc && formik.touched.camera_truoc
								})}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.camera_truoc}
								name="camera_truoc"
								id="camera_truoc"
							/>
							{formik.errors.camera_truoc && formik.touched.camera_truoc && (
								<div className="invalid-feedback">{formik.errors.camera_truoc}</div>
							)}
						</div>
						<div className="col-md-6">
							<label htmlFor="bonhotrong" className="form-label">
								Bộ nhớ trong <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								placeholder="Bộ nhớ  trong"
								className={classNames('form-control', {
									'is-invalid': formik.errors.bo_nho_trong && formik.touched.bo_nho_trong
								})}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.bo_nho_trong}
								name="bo_nho_trong"
								id="bo_nho_trong"
							/>
							{formik.errors.bo_nho_trong && formik.touched.bo_nho_trong && (
								<div className="invalid-feedback">{formik.errors.bo_nho_trong}</div>
							)}
						</div>
						<div className="col-md-6">
							<label htmlFor="thenhongoai" className="form-label">
								Thẻ nhớ ngoài
							</label>
							<input
								type="text"
								placeholder="Thẻ nhớ ngoài"
								className={classNames('form-control', {
									'is-invalid': formik.errors.the_nho_ngoai && formik.touched.the_nho_ngoai
								})}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.the_nho_ngoai}
								name="the_nho_ngoai"
								id="the_nho_ngoai"
							/>
							{formik.errors.the_nho_ngoai && formik.touched.the_nho_ngoai && (
								<div className="invalid-feedback">{formik.errors.the_nho_ngoai}</div>
							)}
						</div>
						<div className="col-md-6">
							<label htmlFor="pin" className="form-label">
								Pin <span className="text-danger">*</span>
							</label>
							<input
								type="text"
								placeholder="Pin"
								className={classNames('form-control', {
									'is-invalid': formik.errors.pin && formik.touched.pin
								})}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.pin}
								name="pin"
								id="pin"
							/>
							{formik.errors.pin && formik.touched.pin && <div className="invalid-feedback">{formik.errors.pin}</div>}
						</div>
						<div className="col-md-6">
							<label htmlFor="hdh" className="form-label">
								Hệ điều hành
							</label>
							<input
								type="text"
								placeholder="Hệ điều hành"
								className={classNames('form-control', {
									'is-invalid': formik.errors.he_dieu_hanh && formik.touched.he_dieu_hanh
								})}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.he_dieu_hanh}
								name="he_dieu_hanh"
								id="he_dieu_hanh"
							/>
							{formik.errors.he_dieu_hanh && formik.touched.he_dieu_hanh && (
								<div className="invalid-feedback">{formik.errors.he_dieu_hanh}</div>
							)}
						</div>
						<div className="col-md-6">
							<label htmlFor="category" className="form-label">
								Danh mục <span className="text-danger">*</span>
							</label>
							<AsyncSelect
								id="category"
								name="category"
								cacheOptions
								defaultOptions
								placeholder="Choose category"
								onChange={(value) => formik.setFieldValue('category', value)}
								onBlur={() => formik.setFieldTouched('category', true)}
								value={formik.values.category}
								loadOptions={promiseCategories}
								getOptionValue={(option) => option.id}
								getOptionLabel={(option) => option.ten_dm}
							/>
							{formik.errors.category && formik.touched.category && (
								<div className="invalid-feedback d-block">{formik.errors.category}</div>
							)}
						</div>
						<div className="col-md-6">
							<label htmlFor="brand" className="form-label">
								Thương hiệu <span className="text-danger">*</span>
							</label>
							<AsyncCreatableSelect
								id="brand"
								name="brand"
								cacheOptions
								defaultOptions
								placeholder="Choose brand"
								onChange={(value) => formik.setFieldValue('brand', value)}
								onBlur={() => formik.setFieldTouched('brand', true)}
								value={formik.values.brand}
								loadOptions={promiseBrands}
								getOptionValue={(option) => option.id}
								getOptionLabel={(option) => option.ten_th}
							/>
							{formik.errors.brand && formik.touched.brand && (
								<div className="invalid-feedback d-block">{formik.errors.brand}</div>
							)}
						</div>
						<div className="col-md-12">
							<label htmlFor="content" className="form-label">
								Content <span className="text-danger">*</span>
							</label>
							<MarkDownEditor
								id="content"
								placeholder="Enter content"
								value={formik.values.content}
								onChange={(value) => formik.setFieldValue('content', value)}
								onBlur={() => formik.setFieldTouched('content', true)}
							/>
							{formik.errors.content && formik.touched.content && (
								<div className="invalid-feedback d-block">{formik.errors.content}</div>
							)}
						</div>
						<div className="col-md-12">
							<button className="btn btn-primary btn-sm me-2" type="submit" disabled={formik.isSubmitting}>
								{formik.isSubmitting ? 'Creating' : 'Create'}
							</button>
						</div>
					</form>
				</Card>
			</div>
		</>
	);
};

export default CreateArticleComponent;
