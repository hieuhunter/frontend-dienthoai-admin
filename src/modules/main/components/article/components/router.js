import React from 'react';
import { Redirect } from 'react-router-dom';
import ListBillComponent from './bill/conponents';
import CreateArticleComponent from './create/components';
import EditArticleComponent from './edit/components';
import ListArticleComponent from './list/components';
import ListUserComponent from './user/component';


const ArticleRouter = [
	{
		path: `/main/articles`,
		exact: true,
		component: ListArticleComponent
	},
	{
		path: `/main/bills`,
		exact: true,
		component: ListBillComponent
	},
	{
		path: `/main/users`,
		exact: true,
		component: ListUserComponent
	},
	{
		path: `/main/articles/create`,
		exact: true,
		component: CreateArticleComponent
	},
	{
		path: `/main/articles/edit/:productId`,
		exact: true,
		component: EditArticleComponent
	},
	{
		path: '*',
		component: () => <Redirect to={`/`} />
	}
];

export default ArticleRouter;
