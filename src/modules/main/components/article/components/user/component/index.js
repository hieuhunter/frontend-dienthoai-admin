import BlockUIComponent from 'common/components/BlockUI/components';
import Breadcrumb from 'common/components/Breadcrumb/components';
import Card from 'common/components/Card/components';
import Pagination from 'common/components/Pagination/components';
import TableLoading from 'common/components/TableLoading/components';
import history from 'common/utils/history';
import httpRequest from 'common/utils/httpRequest';
import pageNumber from 'common/utils/pageNumber';
import React, { useEffect, useState } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import FilterComponent from 'common/components/Filter/components';

const ListUserComponent = () => {
	const auth = useSelector((state) => state.appAuth.current);

	const [formSearch, setFormSearch] = useState({
		q: ''
	});

	const [state, setState] = useState({
		data: {
			customer: [],
			totalAll: 0,
			totalPublished: 0,
			totalTrash: 0,
			totalDraft: 0,
			totalPending: 0
		},
		pagination: {
			customer: {
				page: 1,
				limit: 5,
				limits: [5, 10, 20, 100],
				total: 0
			}
		},
		filters: {
			customer: {
				sortBy: 'id',
				sortDirection: 'desc',
				status: 'all',
				q: ''
			}
		},
		loadings: {
			customer: false
		},
		deletings: {
			customer: false
		}
	});

	const onChangePage = (page) => {
		setState((prevState) => ({
			...prevState,
			pagination: {
				...prevState.pagination,
				customer: {
					...prevState.pagination.customer,
					page: page
				}
			}
		}));
	};

	const onChangeLimit = (limit) => {
		setState((prevState) => ({
			...prevState,
			pagination: {
				...prevState.pagination,
				customer: {
					...prevState.pagination.customer,
					limit: limit,
					page: 1
				}
			}
		}));
	};

	const onDeleteClicked = (event, sanpham) => {
		event.preventDefault();
		if (window.confirm('Do you want to delete?')) {
			setState((prevState) => ({
				...prevState,
				deletings: {
					...prevState.deletings,
					customer: true
				}
			}));
			new Promise((resolve, reject) => {
				httpRequest
					.delete({
						url: `/products/${sanpham.id}`,
						token: auth.token.access_token
					})
					.then((response) => {
						if (!response.data.success) {
							console.log('Error');
							return reject(new Error('Error'));
						}
						return resolve(response);
					})
					.catch((error) => {
						console.log(error);
					})
					.finally(() => {});
			})
				.then((result) => {
					if (!result.data.success) {
						console.log('Error');
						return;
					}
					httpRequest
						.get({
							url: `/listUser`,
							token: auth.token.access_token,
							params: {
								offset: (pageNumber(state.pagination.customer.page) - 1) * state.pagination.customer.limit,
								limit: state.pagination.customer.limit,
								sort_by: state.filters.customer.sortBy,
								sort_direction: state.filters.customer.sortDirection,
								q: state.filters.customer.q
							}
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
									customer: response.data.data
								},
								pagination: {
									...prevState.pagination,
									customer: {
										...prevState.pagination.customer,
										total: response.data.pagination.total
									}
								}
							}));
						})
						.catch((error) => {
							console.log(error);
						})
						.finally(() => {
							setState((prevState) => ({
								...prevState,
								deletings: {
									...prevState.deletings,
									bill: false
								}
							}));
						});
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {});
		}
	};

	// Filters
	const onChangeSortBy = (value) => {
		if (value) {
			setState((prevState) => ({
				...prevState,
				filters: {
					...prevState.filters,
					customer: {
						...prevState.filters.customer,
						sortBy: value
					}
				}
			}));
		}
	};

	const onChangeSortDirection = (value) => {
		if (value) {
			setState((prevState) => ({
				...prevState,
				filters: {
					...prevState.filters,
					customer: {
						...prevState.filters.customer,
						sortDirection: value
					}
				}
			}));
		}
	};

	const handleChangeSearch = (value) => {
		if (!value) {
			setState((prevState) => ({
				...prevState,
				filters: {
					...prevState.filters,
					customer: {
						...prevState.filters.customer,
						q: ''
					}
				},
				pagination: {
					...prevState.pagination,
					customer: {
						...prevState.pagination.customer,
						page: 1
					}
				}
			}));
		}
		setFormSearch({
			q: value
		});
	};

	const handleSubmitSearch = () => {
		setState((prevState) => ({
			...prevState,
			filters: {
				...prevState.filters,
				customer: {
					...prevState.filters.customer,
					q: formSearch.q
				}
			},
			pagination: {
				...prevState.pagination,
				customer: {
					...prevState.pagination.customer,
					page: 1
				}
			}
		}));
	};

	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			loadings: {
				...prevState.loadings,
				customer: true
			}
		}));
		httpRequest
			.get({
				url: `/listUser`,
				token: auth.token.access_token,
				params: {
					offset: (pageNumber(state.pagination.customer.page) - 1) * state.pagination.customer.limit,
					limit: state.pagination.customer.limit,
					sort_by: state.filters.customer.sortBy,
					sort_direction: state.filters.customer.sortDirection,
					q: state.filters.customer.q
				}
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
						customer: response.data.data
					},
					pagination: {
						...prevState.pagination,
						customer: {
							...prevState.pagination.customer,
							total: response.data.pagination.total
						}
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
						customer: false
					}
				}));
			});
		return () => {};
	}, [
		auth.token.access_token,
		state.filters.customer.q,
		state.filters.customer.sortBy,
		state.filters.customer.sortDirection,
		state.pagination.customer.limit,
		state.pagination.customer.page
	]);

	return (
		<>
			<div className="content-header py-3">
				<Breadcrumb>Danh sách khách hàng</Breadcrumb>
			</div>
			<div className="content-body">
				<Card header="List products">
					<div className="position-relative">
						<FilterComponent
							sortBy={state.filters.customer.sortBy}
							onChangeSortBy={onChangeSortBy}
							sortByList={[
								{
									value: 'id',
									label: 'Id'
								},
								{
									value: 'ten_sp',
									label: 'Tên sản phẩm'
								},
								{
									value: 'categories',
									label: 'Danh mục'
								},
								{
									value: 'gia',
									label: 'Giá'
								},
								{
									value: 'so_luong',
									label: 'Số lượng'
								}
							]}
							sortDirection={state.filters.customer.sortDirection}
							onChangeSortDirection={onChangeSortDirection}
							sortDirectionList={[
								{
									value: 'desc',
									label: 'Giảm dần'
								},
								{
									value: 'asc',
									label: 'Tăng dần'
								}
							]}
							q={formSearch.q}
							handleSubmitSearch={handleSubmitSearch}
							handleChangeSearch={handleChangeSearch}
						/>
						{state.loadings.customer ? (
							<TableLoading className="mb-2 mb-sm-3" />
						) : (
							!!state.data.customer.length && (
								<div className="table-responsive-xxl mb-2 mb-sm-3">
									<table className="table table-sm table-striped table-hover table-bordered mb-0" style={{ minWidth: 888 }}>
										<thead>
											<tr>
												<th className="align-middle">Id</th>

												<th className="align-middle">Họ và tên</th>
												<th className="align-middle" style={{ width: '140px' }}>
													Tài khoản
												</th>
												<th className="align-middle">Địa chỉ</th>
												<th className="align-middle">Số điện thoại</th>
												<th className="align-middle">Email</th>

												<th className="align-middle"></th>
											</tr>
										</thead>
										<tbody>
											{state.data.customer.map((kh, index) => (
												<tr key={index}>
													<td className="align-middle small">{kh.id}</td>

													<td className="align-middle small">{kh.ho_ten}</td>
													<td className="align-middle small">{kh.user_name}</td>
													<td className="align-middle small">{kh.dia_chi}</td>
													<td className="align-middle small">{kh.sdt}</td>
													<td className="align-middle small">{kh.email}</td>

													<td className="align-middle">
														<div className="d-flex align-items-center justify-content-center">
															<button
																type="button"
																className="btn btn-secondary d-flex align-items-center me-2"
																onClick={() => history.push(`/main/articles/edit/${kh.id}`)}
															>
																<FaRegEdit />
															</button>
															<button
																type="button"
																className="btn btn-danger d-flex align-items-center"
																onClick={(event) => onDeleteClicked(event, kh)}
																disabled={state.deletings.customer}
															>
																<FaRegTrashAlt />
															</button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)
						)}
						<Pagination
							limits={state.pagination.customer.limits}
							total={state.pagination.customer.total}
							limit={state.pagination.customer.limit}
							currentPage={state.pagination.customer.page}
							onChangePage={onChangePage}
							onChangeLimit={onChangeLimit}
						/>
						<BlockUIComponent blocking={state.deletings.customer} />
					</div>
				</Card>
			</div>
		</>
	);
};

export default ListUserComponent;
