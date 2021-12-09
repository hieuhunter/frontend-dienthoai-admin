import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import httpRequest from 'common/utils/httpRequest';
import AsyncCreatableSelect from 'react-select/async-creatable';
import Card from 'common/components/Card/components';
import Breadcrumb from 'common/components/Breadcrumb/components';
import history from 'common/utils/history';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ImageInput from 'common/components/ImageInput/components';
import AsyncSelect from 'react-select/async';
import classNames from 'classnames';
import { getCookie } from 'common/utils/cookies';

const EditArticleComponent = () => {
	const auth = useSelector((state) => state.appAuth.current);
	const params = useParams();

	const [state, setState] = useState({
		data: {
			product: {}
		},
		loadings: {
			product: false
		}
	});

	const promiseBrand = (q) => {
		return httpRequest
			.get({
				url: `/brand`,
				token: auth.token.access_token,
				params: {
					type: 'brand',
					q: q
				}
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
				token: auth.token.access_token,
				params: {
					type: 'category',
					q: q
				}
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

	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			loadings: {
				...prevState.loadings,
				product: true
			}
		}));
		httpRequest
			.get({
				url: `/products/${params.productId}`,
				token: auth.token.access_token
			})
			.then((response) => {
				if (!response.data.success) {
					console.log('Error');
					return;
				}
				setState((prevState) => ({
					...prevState,
					data: {
						...prevState.data,
						product: response.data.data
					}
				}));
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setState((prevState) => ({
					...prevState,
					loadings: {
						...prevState.loadings,
						product: false
					}
				}));
			});
	}, [auth.token.access_token, params.productId]);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			ten_sp: state.data.product.ten_sp,
			gia_goc: state.data.product.gia_goc,
			gia: state.data.product.gia,
			category: state.data.product.category,
			brand: state.data.product.brand,
			so_luong: state.data.product.so_luong,
			thong_tin_man_hinh: state.data.product.thong_tin_man_hinh,
			cpu: state.data.product.cpu,
			ram: state.data.product.ram,
			camera_sau: state.data.product.camera_sau,
			camera_truoc: state.data.product.camera_truoc,
			bo_nho_trong: state.data.product.bo_nho_trong,
			the_nho_ngoai: state.data.product.the_nho_ngoai,
			pin: state.data.product.pin,
			he_dieu_hanh: state.data.product.he_dieu_hanh,
			kha_dung: Number(state.data.product.kha_dung),
			image_url: state.data.product.image_url,
			hinh: null
		},
		validationSchema: Yup.object({
			hinh: Yup.mixed()
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
			httpRequest
				.formDataPut({
					url: `/products/${params.productId}`,
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

	return (
		<>
			<div className="content-header py-3">
				<Breadcrumb>Sửa sản phẩm</Breadcrumb>
			</div>
			<div className="content-body">
				<Card header="Edit article">
					{state.loadings.product ? (
						<div>Loading...</div>
					) : (
						!!state.data.product.id && (
							<form onSubmit={formik.handleSubmit} className="row g-3">
								<div className="col-md-12">
									<label htmlFor="hinh" className="form-label">
										Hinh <span className="text-danger">*</span>
									</label>
									<ImageInput
										name="hinh"
										id="hinh"
										onChange={formik.setFieldValue}
										onBlur={formik.setFieldTouched}
										previewUrl={formik.values.image_url}
									/>
									{formik.errors.hinh && formik.touched.hinh && (
										<div className="invalid-feedback d-block">{formik.errors.hinh}</div>
									)}
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
									{formik.errors.ten_sp && formik.touched.ten_sp && (
										<div className="invalid-feedback">{formik.errors.ten_sp}</div>
									)}
								</div>
								<div className="col-md-6">
									<label htmlFor="slug" className="form-label">
										Thông tin màn hình
									</label>
									<input
										type="text"
										placeholder="Thong tin man hinh"
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
										placeholder="Gia"
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
										placeholder="Gia goc"
										className={classNames('form-control', {
											'is-invalid': formik.errors.gia_goc && formik.touched.gia_goc
										})}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.gia_goc}
										name="gia_goc"
										id="gia_goc"
									/>
									{formik.errors.gia_goc && formik.touched.gia_goc && (
										<div className="invalid-feedback">{formik.errors.gia_goc}</div>
									)}
								</div>
								<div className="col-md-6">
									<label htmlFor="soluong" className="form-label">
										Số lượng
									</label>
									<input
										type="text"
										placeholder="So luong"
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
										placeholder="Camera truoc"
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
										placeholder="Bo nho trong"
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
										placeholder="The nho ngoai"
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
										placeholder="He dieu hanh"
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
									<label htmlFor="categories" className="form-label">
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
									<label htmlFor="tags" className="form-label">
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
										loadOptions={promiseBrand}
										getOptionValue={(option) => option.id}
										getOptionLabel={(option) => option.ten_th}
									/>
									{formik.errors.brand && formik.touched.brand && (
										<div className="invalid-feedback d-block">{formik.errors.brand}</div>
									)}
								</div>

								{/* <div className="col-md-12">
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
								</div> */}

								{/* <div className="col-md-6">
								<label htmlFor="status" className="form-label">
									Status <span className="text-danger">*</span>
								</label>
								<select
									className={classNames('form-select', {
										'is-invalid': formik.errors.status && formik.touched.status
									})}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.status}
									name="status"
									id="status"
								>
									{[
										{ value: 'publish', label: 'Published' },
										{ value: 'pending', label: 'Pending' },
										{ value: 'draft', label: 'Draft' }
									].map((status, index) => (
										<option value={status.value} key={index}>
											{status.label}
										</option>
									))}
								</select>
								{formik.errors.status && formik.touched.status && <div className="invalid-feedback">{formik.errors.status}</div>}
							</div> */}
								{/* <div className="col-md-12">
								<div className="form-check form-switch m-0">
									<input
										className={classNames('form-check-input')}
										type="checkbox"
										value={formik.values.pending}
										onChange={(value) => {
											formik.setFieldValue('pending', formik.values.pending === 'pending' ? 'pending' : 'draft');
										}}
										checked={formik.values.pending === 'pending'}
										id="pending"
										name="pending"
									/>
									<label className="form-check-label" htmlFor="pending">
										Pending
									</label>
								</div>
							</div> */}
								<div className="col-md-12">
									<button className="btn btn-primary btn-sm me-2" type="submit" disabled={formik.isSubmitting}>
										{formik.isSubmitting ? 'Updatting' : 'Update'}
									</button>
								</div>
							</form>
						)
					)}
				</Card>
			</div>
		</>
	);
};

export default EditArticleComponent;
