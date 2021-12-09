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

const ListArticleComponent = () => {
	const auth = useSelector((state) => state.appAuth.current);

	const [formSearch, setFormSearch] = useState({
		q: ''
	});

	const [state, setState] = useState({
		data: {
			sanpham: [],
			totalAll: 0,
			totalPublished: 0,
			totalTrash: 0,
			totalDraft: 0,
			totalPending: 0
		},
		pagination: {
			sanpham: {
				page: 1,
				limit: 5,
				limits: [5, 10, 20, 100],
				total: 0
			}
		},
		filters: {
			sanpham: {
				sortBy: 'id',
				sortDirection: 'desc',
				status: 'all',
				q: ''
			}
		},
		loadings: {
			sanpham: false
		},
		deletings: {
			sanpham: false
		}
	});

	const onChangePage = (page) => {
		setState((prevState) => ({
			...prevState,
			pagination: {
				...prevState.pagination,
				sanpham: {
					...prevState.pagination.sanpham,
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
				sanpham: {
					...prevState.pagination.sanpham,
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
					sanpham: true
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
							url: `/sanpham`,
							token: auth.token.access_token,
							params: {
								offset: (pageNumber(state.pagination.sanpham.page) - 1) * state.pagination.sanpham.limit,
								limit: state.pagination.sanpham.limit,
								sort_by: state.filters.sanpham.sortBy,
								sort_direction: state.filters.sanpham.sortDirection,
								q: state.filters.sanpham.q
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
									sanpham: response.data.data
								},
								pagination: {
									...prevState.pagination,
									sanpham: {
										...prevState.pagination.sanpham,
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
									sanpham: false
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
					sanpham: {
						...prevState.filters.sanpham,
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
					sanpham: {
						...prevState.filters.sanpham,
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
					sanpham: {
						...prevState.filters.sanpham,
						q: ''
					}
				},
				pagination: {
					...prevState.pagination,
					sanpham: {
						...prevState.pagination.sanpham,
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
				sanpham: {
					...prevState.filters.sanpham,
					q: formSearch.q
				}
			},
			pagination: {
				...prevState.pagination,
				sanpham: {
					...prevState.pagination.sanpham,
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
				sanpham: true
			}
		}));
		httpRequest
			.get({
				url: `/sanpham`,
				token: auth.token.access_token,
				params: {
					offset: (pageNumber(state.pagination.sanpham.page) - 1) * state.pagination.sanpham.limit,
					limit: state.pagination.sanpham.limit,
					sort_by: state.filters.sanpham.sortBy,
					sort_direction: state.filters.sanpham.sortDirection,
					q: state.filters.sanpham.q
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
						sanpham: response.data.data
					},
					pagination: {
						...prevState.pagination,
						sanpham: {
							...prevState.pagination.sanpham,
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
						sanpham: false
					}
				}));
			});
		return () => {};
	}, [
		auth.token.access_token,
		state.filters.sanpham.q,
		state.filters.sanpham.sortBy,
		state.filters.sanpham.sortDirection,
		state.pagination.sanpham.limit,
		state.pagination.sanpham.page
	]);

	return (
		<>
			<div className="content-header py-3">
				<Breadcrumb>Danh sách sản phẩm</Breadcrumb>
			</div>
			<div className="content-body">
				<Card header="List products">
					<div className="position-relative">
						<FilterComponent
							sortBy={state.filters.sanpham.sortBy}
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
							sortDirection={state.filters.sanpham.sortDirection}
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
						{state.loadings.sanpham ? (
							<TableLoading className="mb-2 mb-sm-3" />
						) : (
							!!state.data.sanpham.length && (
								<div className="table-responsive-xxl mb-2 mb-sm-3">
									<table className="table table-sm table-striped table-hover table-bordered mb-0" style={{ minWidth: 888 }}>
										<thead>
											<tr>
												<th className="align-middle">Id</th>
												<th className="align-middle" style={{ width: '109px' }}>
													Hình
												</th>
												<th className="align-middle">Tên</th>
												<th className="align-middle" style={{ width: '200px' }}>
													Danh mục
												</th>
												<th className="align-middle">gia</th>
												<th className="align-middle">giá gốc</th>
												<th className="align-middle">số lượng</th>
												<th className="align-middle">cpu</th>
												<th className="align-middle">ram</th>
												<th className="align-middle">pin</th>
												<th className="align-middle"></th>
											</tr>
										</thead>
										<tbody>
											{state.data.sanpham.map((sanpham, index) => (
												<tr key={index}>
													<td className="align-middle small">{sanpham.id}</td>
													<td className="align-middle">
														{sanpham.hinh && (
															<CustomImageComponent src={sanpham.image_url} width={100} height={60} alt={sanpham.ten_sp} />
														)}
													</td>
													<td className="align-middle small">{sanpham.ten_sp}</td>
													<td className="align-middle small">{sanpham.category.ten_dm}</td>
													<td className="align-middle small">{sanpham.gia}</td>
													<td className="align-middle small">{sanpham.gia_goc}</td>
													<td className="align-middle small">{sanpham.so_luong}</td>
													<td className="align-middle small">{sanpham.cpu}</td>
													<td className="align-middle small">{sanpham.ram}</td>
													<td className="align-middle small">{sanpham.pin}</td>
													<td className="align-middle">
														<div className="d-flex align-items-center justify-content-center">
															<button
																type="button"
																className="btn btn-secondary d-flex align-items-center me-2"
																onClick={() => history.push(`/main/articles/edit/${sanpham.id}`)}
															>
																<FaRegEdit />
															</button>
															<button
																type="button"
																className="btn btn-danger d-flex align-items-center"
																onClick={(event) => onDeleteClicked(event, sanpham)}
																disabled={state.deletings.sanpham}
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
							limits={state.pagination.sanpham.limits}
							total={state.pagination.sanpham.total}
							limit={state.pagination.sanpham.limit}
							currentPage={state.pagination.sanpham.page}
							onChangePage={onChangePage}
							onChangeLimit={onChangeLimit}
						/>
						<BlockUIComponent blocking={state.deletings.sanpham} />
					</div>
				</Card>
			</div>
		</>
	);
};

export default ListArticleComponent;
