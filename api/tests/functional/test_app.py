import json

from app import get_months


def test_get_months(flask_app_mock, mock_get_sqlalchemy, mock_month_object, mock_is_valid_token):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.all.return_value = mock_month_object
        response = get_months()
        assert response == '[{"monthsRecords": [], "monthStats": [], "id": 1, "month_name": "JAN"}]'


def test_get_months_post_request_method_not_allowed(client):
    response = client.post('/get_months')
    assert response.status_code == 405


def test_get_category_by_name_no_category_param(client):
    response = client.get('/get_category_by_name?token=abc')
    assert response.status_code == 400
    assert response.data == b'No category parameter'


def test_get_category_by_name_no_category_found(client, flask_app_mock, mock_get_sqlalchemy):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.filter_by.return_value.one_or_none.return_value = None
        response = client.get('/get_category_by_name?cat_type=hello')

        assert response.status_code == 400
        assert response.data == b'Category type not found'


def test_get_category_by_name_success(client, flask_app_mock, mock_get_sqlalchemy, mock_category_object):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.filter_by.return_value.one_or_none.return_value = mock_category_object
        response = client.get('/get_category_by_name?cat_type=cat1')

        assert response.data == b'1'


def test_get_category_by_name_post_method_not_allowed(client):
    response = client.post('/get_category_by_name')
    assert response.status_code == 405


def test_get_month_records_success(flask_app_mock, client, mock_get_sqlalchemy, mock_month_record_object,
                                   mock_is_valid_token):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.all.return_value = mock_month_record_object
        response = client.get('/get_month_records')

        assert response.data == b'[{"uncategorizedItems": [], "id": 1, "year_num": null, "date_val": null, "amount": null, ' \
                                b'"descr": "this is a month record", "is_positive": null, "month_id": null, "cat_id": null, ' \
                                b'"category": null}]'


def test_get_month_records_post_method_not_allowed(client):
    response = client.post('/get_month_records')
    assert response.status_code == 405


def test_get_month_stats(flask_app_mock, client, mock_get_sqlalchemy, mock_month_stat_object, mock_is_valid_token):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.all.return_value = mock_month_stat_object
        response = client.get('/get_month_stats')

        assert response.data == b'[{"id": 1, "year_num": null, "date_val": null, "paycheck_planned": null, "other_planned": ' \
                                b'null, "expenses_planned": null, "needs_planned": null, "wants_planned": null, ' \
                                b'"savings_planned": null, "paycheck_actual": null, "other_actual": null, ' \
                                b'"expenses_actual": null, "needs_actual": null, "wants_actual": null, "savings_actual": ' \
                                b'null, "month_id": null}]'


def test_get_month_stats_post_method_not_allowed(client):
    response = client.post('/get_month_stats')
    assert response.status_code == 405


def test_get_month_record_by_invalid_year(client, mock_is_valid_token):
    response = client.get('/get_month_record_by_year_and_month?year=1&month=JAN')
    assert response.status_code == 400
    assert response.data == b'Invalid year or month parameter'


def test_get_month_record_by_invalid_month(client, mock_is_valid_token):
    response = client.get('/get_month_record_by_year_and_month?year=2001&month=MARC')
    assert response.status_code == 400
    assert response.data == b'Invalid year or month parameter'


def test_get_month_record_by_month_and_year_success(client, flask_app_mock, mock_get_sqlalchemy,
                                                    mock_month_object_no_list, mock_month_record_object,
                                                    mock_is_valid_token):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.filter_by.return_value.one_or_none.return_value = mock_month_object_no_list
        mock_get_sqlalchemy.filter_by.return_value.all.return_value = mock_month_record_object
        response = client.get('/get_month_record_by_year_and_month?year=2001&month=MAR')

        assert response.status_code == 200
        assert response.data == b'[{"uncategorizedItems": [], "id": 1, "year_num": null, "date_val": null, "am' \
                                b'ount": null, "descr": "this is a month record", "is_positive": null, "month_' \
                                b'id": null, "cat_id": null, "category": null}]'


def test_get_month_record_by_id_success(client, flask_app_mock, mock_get_sqlalchemy, mock_month_record_object_no_list,
                                        mock_is_valid_token):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.filter_by.return_value.one_or_none.return_value = mock_month_record_object_no_list
        response = client.get('/get_month_record_by_id')

        assert response.status_code == 200
        assert response.data == b'{"uncategorizedItems": [], "id": 2, "year_num": null, "date_val": null, "amo' \
                                b'unt": null, "descr": "second month record", "is_positive": null, "month_id":' \
                                b' null, "cat_id": null, "category": null}'


def test_get_month_record_by_id_post_method_not_allowed(client):
    response = client.post('/get_month_record_by_id')
    assert response.status_code == 405


def test_get_month_id_by_name_no_name_specified(client, mock_is_valid_token):
    response = client.get('/get_month_id_by_name?name=')

    assert response.status_code == 400


def test_get_month_id_by_name_success(client, flask_app_mock, mock_month_object_no_list, mock_get_sqlalchemy,
                                      mock_is_valid_token):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.filter_by.return_value.one_or_none.return_value = mock_month_object_no_list
        response = client.get('/get_month_id_by_name?name=JAN')

        assert response.data == b'1'


def test_get_month_id_by_name_post_method_not_allowed(client):
    response = client.post('/get_month_id_by_name')
    assert response.status_code == 405


def test_ingest_edu_checkings_success(client, mock_parse_checkings_process_rows, mock_is_valid_token,
                                      mock_parse_checkings_close_session):
    response = client.post('/ingest_edu_checking', json={})
    assert response.status_code == 200
    assert json.loads(response.data)['amount_processed'] == 5
    mock_parse_checkings_close_session.assert_called_with()


def test_ingest_edu_checkings_get_method_not_allowed(client):
    response = client.get('/ingest_edu_checking')
    assert response.status_code == 405


def test_ingest_edu_savings_success(client, mock_parse_savings_process_rows, mock_parse_savings_close_session,
                                    mock_is_valid_token):
    response = client.post('/ingest_edu_saving', json={})
    assert response.status_code == 200
    assert json.loads(response.data)['amount_processed'] == 3
    mock_parse_savings_close_session.assert_called_with()


def test_ingest_edu_savings_get_method_not_allowed(client):
    response = client.get('/ingest_edu_saving')
    assert response.status_code == 405


def test_ingest_disc_success(client, mock_parse_disc_process_rows, mock_parse_disc_close_session,
                             mock_is_valid_token):
    response = client.post('/ingest_disc', json={})
    assert response.status_code == 200
    assert json.loads(response.data)['amount_processed'] == 4
    mock_parse_disc_close_session.assert_called_with()


def test_ingest_disc_get_method_not_allowed(client):
    response = client.get('/ingest_disc')
    assert response.status_code == 405


def test_get_month_records_uncategorized_success(client, flask_app_mock, mock_get_sqlalchemy, mock_is_valid_token,
                                                 mock_month_record_multi):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.filter_by.return_value = mock_month_record_multi
        response = client.get('/get_month_records_uncat')

        assert response.data == b'[{"uncategorizedItems": [], "id": 1, "year_num": null, "date_val": null, "am' \
                                b'ount": null, "descr": "first", "is_positive": null, "month_id": null, "cat_i' \
                                b'd": null, "category": null}, {"uncategorizedItems": [], "id": 2, "year_num":' \
                                b' null, "date_val": null, "amount": null, "descr": "second", "is_positive": n' \
                                b'ull, "month_id": null, "cat_id": null, "category": null}]'


def test_get_month_records_uncategorized_post_method_not_allowed(client):
    response = client.post('/get_month_records_uncat')
    assert response.status_code == 405


def test_set_record_uncategorized_items_success(client, mock_is_valid_token,
                                                mock_uncategorized_services_set_multiple_record_categories):
    response = client.post('/set_record_categories', json={})
    assert response.status_code == 200
    assert response.data == b'Month records updated: 1'
    mock_uncategorized_services_set_multiple_record_categories.assert_called_with({}, )


def test_set_record_uncategorized_items_get_method_not_allowed(client):
    response = client.get('/set_record_categories')
    assert response.status_code == 405


def test_ignore_uncategorized_items_success(client, mock_is_valid_token,
                                            mock_uncategorized_services_ignore_uncategorized_items):
    response = client.post('/ignore_uncategorized_items', json={})
    assert response.status_code == 200
    mock_uncategorized_services_ignore_uncategorized_items.assert_called_with({}, )
