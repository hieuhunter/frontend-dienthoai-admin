import BlockUIComponent from 'common/components/BlockUI/components';
import Breadcrumb from 'common/components/Breadcrumb/components';
import Card from 'common/components/Card/components';
import CustomImageComponent from 'common/components/CustomImage/components';
import Pagination from 'common/components/Pagination/components';
import TableLoading from 'common/components/TableLoading/components';
import history from 'common/utils/history';
import httpRequest from 'common/utils/httpRequest';
import pageNumber from 'common/utils/pageNumber';
import React, { useEffect, useState } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import FilterComponent from 'common/components/Filter/components';
import { Fragment } from 'react';

const ListBillComponent = () => {
	const auth = useSelector((state) => state.appAuth.current);

	const [formSearch, setFormSearch] = useState({
		q: ''
	});

	const [state, setState] = useState({
		data: {
			bill: [],
			totalAll: 0,
			totalPublished: 0,
			totalTrash: 0,
			totalDraft: 0,
			totalPending: 0
		},
		pagination: {
			bill: {
				page: 1,
				limit: 5,
				limits: [5, 10, 20, 100],
				total: 0
			}
		},
		filters: {
			bill: {
				sortBy: 'id',
				sortDirection: 'desc',
				status: 'all',
				q: ''
			}
		},
		loadings: {
			bill: false
		},
		deletings: {
			bill: false
		}
	});

	const onChangePage = (page) => {
		setState((prevState) => ({
			...prevState,
			pagination: {
				...prevState.pagination,
				bill: {
					...prevState.pagination.bill,
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
				bill: {
					...prevState.pagination.bill,
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
					bill: true
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
							url: `/bill`,
							token: auth.token.access_token,
							params: {
								offset: (pageNumber(state.pagination.bill.page) - 1) * state.pagination.bill.limit,
								limit: state.pagination.bill.limit,
								sort_by: state.filters.bill.sortBy,
								sort_direction: state.filters.bill.sortDirection,
								q: state.filters.bill.q
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
									bill: response.data.data
								},
								pagination: {
									...prevState.pagination,
									bill: {
										...prevState.pagination.bill,
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
					bill: {
						...prevState.filters.bill,
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
					bill: {
						...prevState.filters.bill,
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
					bill: {
						...prevState.filters.bill,
						q: ''
					}
				},
				pagination: {
					...prevState.pagination,
					bill: {
						...prevState.pagination.bill,
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
				bill: {
					...prevState.filters.bill,
					q: formSearch.q
				}
			},
			pagination: {
				...prevState.pagination,
				bill: {
					...prevState.pagination.bill,
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
				bill: true
			}
		}));
		httpRequest
			.get({
				url: `/bill`,
				token: auth.token.access_token,
				params: {
					offset: (pageNumber(state.pagination.bill.page) - 1) * state.pagination.bill.limit,
					limit: state.pagination.bill.limit,
					sort_by: state.filters.bill.sortBy,
					sort_direction: state.filters.bill.sortDirection,
					q: state.filters.bill.q
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
						bill: response.data.data
					},
					pagination: {
						...prevState.pagination,
						bill: {
							...prevState.pagination.bill,
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
						bill: false
					}
				}));
			});
		return () => {};
	}, [
		auth.token.access_token,
		state.filters.bill.q,
		state.filters.bill.sortBy,
		state.filters.bill.sortDirection,
		state.pagination.bill.limit,
		state.pagination.bill.page
	]);

	return (
		<>
			<div className="content-header py-3">
				<Breadcrumb>Danh sách hóa đơn</Breadcrumb>
			</div>
			<div className="content-body">
				<Card header="List products">
					<div className="position-relative">
						<FilterComponent
							sortBy={state.filters.bill.sortBy}
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
							sortDirection={state.filters.bill.sortDirection}
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
						{state.loadings.bill ? (
							<TableLoading className="mb-2 mb-sm-3" />
						) : (
							!!state.data.bill.length && (
								<div className="table-responsive-xxl mb-2 mb-sm-3">
									<table className="table table-sm table-striped table-hover table-bordered mb-0" style={{ minWidth: 888 }}>
										<thead>
											<tr>
												<th className="align-middle">Id</th>
												<th className="align-middle" style={{ width: '150px' }}>
													Tên khách hàng
												</th>
												<th className="align-middle">Địa chỉ</th>
												<th className="align-middle">Số điện thoại</th>
												<th className="align-middle"></th>
											</tr>
										</thead>
										<tbody>
											{state.data.bill.map((bill, index) => (
												<Fragment key={index}>
													<tr>
														<td className="align-middle small">{bill.id}</td>

														<td className="align-middle small">{bill.ho_ten}</td>
														<td className="align-middle small">{bill.dia_chi}</td>
														<td className="align-middle small">{bill.sdt}</td>
														<td className="align-middle">
															<div className="d-flex align-items-center justify-content-center">
																<button
																	type="button"
																	className="btn btn-secondary d-flex align-items-center me-2"
																	onClick={() => history.push(`/main/articles/edit/${bill.id}`)}
																>
																	<FaRegEdit />
																</button>
																<button
																	type="button"
																	className="btn btn-danger d-flex align-items-center"
																	onClick={(event) => onDeleteClicked(event, bill)}
																	disabled={state.deletings.bill}
																>
																	<FaRegTrashAlt />
																</button>
															</div>
														</td>
													</tr>
													{!!bill.ctbill?.length && (
														<tr>
															<td colSpan="1"></td>
															<td colSpan="4">
																<table className="table table-sm table-striped table-bordered">
																	<thead>
																		<tr>
																			<th className="align-middle" style={{ width: '109px' }}>
																				Hình
																			</th>
																			<th className="align-middle">Tên sản phẩm</th>
																			<th className="align-middle">Gia</th>
																			<th className="align-middle">So luong</th>
																		</tr>
																	</thead>
																	<tbody>
																		{bill.ctbill.map((ctbill, index) => (
																			<tr key={index}>
																				<td className="align-middle">
																					{ctbill.product.image_url && (
																						<CustomImageComponent
																							src={ctbill.product.image_url}
																							width={100}
																							height={60}
																							alt={ctbill.product.ten_sp}
																						/>
																					)}
																				</td>
																				<td className="align-middle small">{ctbill.product.ten_sp}</td>
																				<td className="align-middle small">{ctbill.gia}</td>
																				<td className="align-middle small">{ctbill.so_luong}</td>
																			</tr>
																		))}
																	</tbody>
																</table>
															</td>
														</tr>
													)}
												</Fragment>
											))}
										</tbody>
									</table>
								</div>
							)
						)}
						<Pagination
							limits={state.pagination.bill.limits}
							total={state.pagination.bill.total}
							limit={state.pagination.bill.limit}
							currentPage={state.pagination.bill.page}
							onChangePage={onChangePage}
							onChangeLimit={onChangeLimit}
						/>
						<BlockUIComponent blocking={state.deletings.bill} />
					</div>
				</Card>
			</div>
		</>
	);
};

export default ListBillComponent;
