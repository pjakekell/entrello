// // import { takeLatest } from 'redux-saga/effects'

// export const SET_LOADING = 'SET_LOADING_EVENT_FORM_WIZARD'
// export const SET_ERROR = 'SET_ERROR_EVENT_FORM_WIZARD'

// const initialState = {
//   error: null,
//   loading: false,
// }

// export const reducer = (state = initialState, action) => {
//   const actions = {
//     [SET_LOADING]: ({ value }) => state.set('loading', value),
//     [SET_ERROR]: ({ msg, opts }) => state.set('error', { error: msg, ...opts }),
//   }
//   return actions[action.type] ? actions[action.type](action) : state
// }

// /* ---------------------------------------------- ACTIONS -------*/

// export const setLoading = value => ({
//   type: SET_LOADING,
//   value,
// })

// export const setError = code => ({
//   type: SET_ERROR,
//   code,
// })

// /* ---------------------------------------------- SAGAS -----------*/

// // function* injectUrlFilters() {
// //   const filters = yield select(makeSelectSearchFilters());
// //   const filtersArr = filters.keySeq().reduce((acc, key) =>
// //     acc.push(`${key}=${filters.get(key)}`) && acc
// //     , []);
// //   if (filtersArr) return `?${filtersArr.join('&')}`;
// //   return '';
// // }

// // function* injectQuery(filters) {
// //   const query = yield select(makeSelectSearchQuery());
// //   if (isEmpty(query)) return '';

// //   return `${filters.length > 0 ? '&' : '?'}query=${query}`;
// // }

// // function* ajaxGetActivitiesByFilter() {
// //   try {

// //     yield put(setLoading(true));
// //     const filters = yield injectUrlFilters();
// //     const url = `/activities${filters}${yield injectQuery(filters)}`;
// //     const response = yield call(apiGet, url);
// //     yield put(clearActivities());
// //     yield put(pushActivities(response.activities));
// //     yield put(setTotal(response.total));
// //   } catch (error) {
// //     log.error(error);
// //     yield put(toastError('Something went wrong fetching activities', error));
// //     throw (error);
// //   } finally {
// //     yield put(setLoading(false));
// //   }
// // }

// export const sagas = function* () {
//   // yield takeLatest(FETCH_ACTIVITIES, ajaxGetActivitiesByFilter);
// }
