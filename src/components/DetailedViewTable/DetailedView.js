import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableHead from '@material-ui/core/TableHead';
import axios from 'axios';
import Spinner from '../UI/Spinner/Spinner';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class CustomPaginationActionsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      page: 0,
      rowsPerPage: 3,
    };
  }

  componentDidMount=()=>{
    const query = new URLSearchParams(this.props.location.search);
    let description=null;
    let sbu=null;
    let counter=null;

    for (let param of query.entries()) {
        switch(param[0]){
            case 'description':
                description=param[1];
                break;
            case 'sbu':
                sbu=param[1];
                break;
            case 'counter':
                counter=param[1]
                break;
            default:
                console.log('Error: query string params do not match anything');
        } 
    }

    axios.get(`http://127.0.0.1:8000/tracentries/${description}/${sbu}/${counter}`)
        .then((response)=>{
            console.log(response.data);
            this.setState({data:response.data});
        })
        .catch((error)=>{
            console.log(error);
        });
}

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {

    let table=<Spinner/>;

    if(this.state.data){
        const { classes } = this.props;
        const { data, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
        <Paper className={classes.root}>
            <div className={classes.tableWrapper}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell >Serial</TableCell>
                        <TableCell >Description</TableCell>
                        <TableCell >SBU</TableCell>
                        <TableCell >Scope</TableCell>
                        <TableCell >Review Frequency</TableCell>
                        <TableCell >Last Review Date</TableCell>
                        <TableCell >Next Review Date</TableCell>
                        <TableCell >Days</TableCell>
                        <TableCell >Expired</TableCell>
                        <TableCell >Regulatory</TableCell>
                        <TableCell >Approved</TableCell>
                        <TableCell >Responsibility</TableCell>
                        <TableCell >Note</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                    return (
                    <TableRow key={n.serial}>
                        <TableCell numeric>{n.serial}</TableCell>
                        <TableCell component="th" scope="row">
                        {n.description}
                        </TableCell>
                        <TableCell numeric>{n.sbu}</TableCell>
                        <TableCell numeric>{n.scope}</TableCell>
                        <TableCell numeric>{n.reviewFrequency}</TableCell>
                        <TableCell numeric>{n.lastReviewDate}</TableCell>
                        <TableCell numeric>{n.nextReviewDate}</TableCell>
                        <TableCell numeric>{n.days}</TableCell>
                        <TableCell numeric>{n.expired}</TableCell>
                        <TableCell numeric>{n.regulatory}</TableCell>
                        <TableCell numeric>{n.approved}</TableCell>
                        <TableCell numeric>{n.responsibility}</TableCell>
                        <TableCell numeric>{n.note}</TableCell>
                    </TableRow>
                    );
                })}
                {emptyRows > 0 && (
                    <TableRow style={{ height: 48 * emptyRows }}>
                    <TableCell colSpan={6} />
                    </TableRow>
                )}
                </TableBody>
                <TableFooter>
                <TableRow>
                    <TablePagination
                    colSpan={3}
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActionsWrapped}
                    />
                </TableRow>
                </TableFooter>
            </Table>
            </div>
        </Paper>
        );
    }
    return table;
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomPaginationActionsTable);