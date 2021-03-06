import * as React from 'react';
import { DataGrid, GridActionsCellItem,	GridRenderCellParams, GridToolbar} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

const renderStateStyle = (params: GridRenderCellParams<string>) => {
	let value = params.value;

	if (value === 'bom') {
		return <p className={styles.dataTableStateGreen}>Bom</p>;
	} else if (value === 'Necessário troca') {
		return <p className={styles.dataTableStateRed}>Necessário troca</p>;
	} else return <p className={styles.dataTableStateOrange}>Gasto</p>;
};

const columns = [
	{ field: 'id', headerName: 'Código', width: 90, disableColumnMenu: true },
	{
		field: 'descricao',
		headerName: 'Descrição',
		width: 130,
		disableColumnMenu: true,
	},
	{ field: 'local', headerName: 'Local', width: 190, disableColumnMenu: true },
	{
		field: 'estado',
		headerName: 'Estado de Conservação',
		width: 190,
		disableColumnMenu: true,
		renderCell: renderStateStyle,
	},
	{
		field: 'data',
		headerName: 'Data de Registro',
		width: 150,
		disableColumnMenu: true,
	},
	{
		field: 'obs',
		headerName: 'Observações',
		sortable: false,
		width: 220,
		disableColumnMenu: true,
	},
	{
		field: 'excluir',
		type: 'actions',
		width: 80,
		getActions: (params: any) => [
			<GridActionsCellItem
				key={params.id}
				icon={<EditIcon />}
				label='Delete'
				onClick={() => console.log(params.id)}
			/>,
			<GridActionsCellItem
				key={params.id}
				icon={<DeleteIcon />}
				label='Delete'
				onClick={() => console.log(params.id)}
			/>,
		],
	},
];

export default function DataTable() {
	const [items, setItems] = useState([]);

	useEffect(() => {
		api.get('/item').then((response) => setItems(response.data));
	}, []);

	const rows = items.map((item: any) => {		
		return {
			id: item.codigo,
			descricao: item.descricao,
			local: item.local,
			estado: item.estado,
			data: formatData(item.criadoEm),
			obs: item.observacao,
		};
	});

	return (
		<div style={{ height: 650, width: '100%' }}>
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={10}
				rowsPerPageOptions={[5]}
				components={{ Toolbar: GridToolbar }}
			/>
			<Box sx={{position: 'fixed', left: '90%', bottom: '5%'}}>
				<Fab color='primary' aria-label='add'>
					<AddIcon />
				</Fab>
			</Box>
		</div>
	);
}

function formatData(data: string) {
	let regex = /.*(?=T\w)/gi;
	let withoutHours = data.match(regex);
	if(withoutHours !== null) {
		let date = withoutHours[0].split("-").reverse().join("/")
		return date;
	}
	return
}