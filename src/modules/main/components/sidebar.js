import classNames from 'classnames';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { FaBook, FaListAlt, FaPlus, FaRegCircle, FaTachometerAlt, FaTags, FaThLarge } from 'react-icons/fa';

import CustomImageComponent from 'common/components/CustomImage/components';
import CustomLinkComponent from 'common/components/CustomLink/components';
import CustomToggle from 'common/components/CustomToggle/components';
import { useLocation } from 'react-router-dom';
import config from 'config';

const SidebarComponent = ({ wrapperRef }) => {
	const location = useLocation();

	return (
		<div className="main-sidebar shadow-sm" ref={wrapperRef}>
			<div className="py-2 px-4 border-bottom border-secondary sidebar-header">
				<CustomLinkComponent href="/" className="d-flex align-items-center text-white text-decoration-none">
					<CustomImageComponent className="rounded-circle" src={config.LOGO_URL} width={42} height={42} alt="" />
					<span className="ms-2 fs-5 fw-bolder">De4th Zone</span>
				</CustomLinkComponent>
			</div>
			<div className="px-2 py-3 sidebar-body">
				<ul className="list-group">
					<Accordion
						as="li"
						className="list-group-item border-0 p-0"
						defaultActiveKey={location.pathname === '/main/dashboard' ? 'dashboard' : ''}
					>
						<CustomToggle
							eventKey="dashboard"
							className={classNames({
								'active-page': location.pathname === '/main/dashboard'
							})}
						>
							<>
								<FaTachometerAlt className="me-2 fs-5" /> Dashboard
							</>
						</CustomToggle>
						<Accordion.Collapse eventKey="dashboard">
							<>
								<CustomLinkComponent
									href="/main/dashboard"
									className={classNames('d-flex align-items-center dropdown-item p-2 ps-4 mb-1', {
										'active-page': location.pathname === '/main/dashboard'
									})}
								>
									<FaRegCircle className="me-2 fs-5" /> Dashboard v1
								</CustomLinkComponent>
							</>
						</Accordion.Collapse>
					</Accordion>
					<Accordion
						as="li"
						className="list-group-item border-0 p-0"
						defaultActiveKey={
							location.pathname === '/main/articles' || location.pathname === '/main/articles/create' ? 'articles' : ''
						}
					>
						<CustomToggle
							eventKey="articles"
							className={classNames({
								'active-page': location.pathname === '/main/articles' || location.pathname === '/main/articles/create'
							})}
						>
							<>
								<FaBook className="me-2 fs-5" /> Articles
							</>
						</CustomToggle>
						<Accordion.Collapse eventKey="articles">
							<>
								<CustomLinkComponent
									href="/main/articles"
									className={classNames('d-flex align-items-center dropdown-item p-2 ps-4 mb-1', {
										'active-page': location.pathname === '/main/articles'
									})}
								>
									<FaListAlt className="me-2 fs-5" /> Lists
								</CustomLinkComponent>
								<CustomLinkComponent
									href="/main/bills"
									className={classNames('d-flex align-items-center dropdown-item p-2 ps-4 mb-1', {
										'active-page': location.pathname === '/main/bills'
									})}
								>
									<FaListAlt className="me-2 fs-5" /> Lists bill
								</CustomLinkComponent>
								<CustomLinkComponent
									href="/main/users"
									className={classNames('d-flex align-items-center dropdown-item p-2 ps-4 mb-1', {
										'active-page': location.pathname === '/main/user'
									})}
								>
									<FaListAlt className="me-2 fs-5" /> Lists user
								</CustomLinkComponent>
								<CustomLinkComponent
									href="/main/articles/create"
									className={classNames('d-flex align-items-center dropdown-item p-2 ps-4 mb-1', {
										'active-page': location.pathname === '/main/articles/create'
									})}
								>
									<FaPlus className="me-2 fs-5" /> Create
								</CustomLinkComponent>
							</>
						</Accordion.Collapse>
					</Accordion>
					<Accordion
						as="li"
						className="list-group-item border-0 p-0"
						defaultActiveKey={
							location.pathname === '/main/categories' || location.pathname === '/main/categories/create' ? 'categories' : ''
						}
					>
						<CustomToggle
							eventKey="categories"
							className={classNames({
								'active-page': location.pathname === '/main/categories' || location.pathname === '/main/categories/create'
							})}
						>
							<>
								<FaThLarge className="me-2 fs-5" /> Categories
							</>
						</CustomToggle>
						<Accordion.Collapse eventKey="categories">
							<>
								<CustomLinkComponent
									href="/main/categories"
									className={classNames('d-flex align-items-center dropdown-item p-2 ps-4 mb-1', {
										'active-page': location.pathname === '/main/categories'
									})}
								>
									<FaListAlt className="me-2 fs-5" /> Lists
								</CustomLinkComponent>
						
								<CustomLinkComponent
									href="/main/categories/create"
									className={classNames('d-flex align-items-center dropdown-item p-2 ps-4 mb-1', {
										'active-page': location.pathname === '/main/categories/create'
									})}
								>
									<FaPlus className="me-2 fs-5" /> Create
								</CustomLinkComponent>
							</>
						</Accordion.Collapse>
					</Accordion>
					<Accordion
						as="li"
						className="list-group-item border-0 p-0"
						defaultActiveKey={location.pathname === '/main/tags' || location.pathname === '/main/tags/create' ? 'tags' : ''}
					>
						<CustomToggle
							eventKey="tags"
							className={classNames({
								'active-page': location.pathname === '/main/tags' || location.pathname === '/main/tags/create'
							})}
						>
							<>
								<FaTags className="me-2 fs-5" /> Tags
							</>
						</CustomToggle>
						<Accordion.Collapse eventKey="tags">
							<>
								<CustomLinkComponent
									href="/main/tags"
									className={classNames('d-flex align-items-center dropdown-item p-2 ps-4 mb-1', {
										'active-page': location.pathname === '/main/tags'
									})}
								>
									<FaListAlt className="me-2 fs-5" /> Lists
								</CustomLinkComponent>
								<CustomLinkComponent
									href="/main/tags/create"
									className={classNames('d-flex align-items-center dropdown-item p-2 ps-4 mb-1', {
										'active-page': location.pathname === '/main/tags/create'
									})}
								>
									<FaPlus className="me-2 fs-5" /> Create
								</CustomLinkComponent>
							</>
						</Accordion.Collapse>
					</Accordion>
				</ul>
			</div>
		</div>
	);
};

export default SidebarComponent;
