import json

def test_get_months(client, flask_app_mock, mock_get_sqlalchemy, mock_month_object, mock_is_valid_token):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.all.return_value = mock_month_object
        response = client.get('/months')
        response_object = json.loads(response.data)
        assert response_object["months"][0]["id"] == 1
        assert response_object["months"][0]["month_name"] == "JAN"


def test_get_months_post_request_method_not_allowed(client):
    response = client.post('/months')
    assert response.status_code == 405


def test_get_category_by_name_no_category_param(client):
    response = client.get('/categories/type/')
    assert response.status_code == 404


def test_get_category_by_name_no_category_found(client, flask_app_mock, mock_get_sqlalchemy):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.filter_by.return_value.one_or_none.return_value = None
        response = client.get('/categories/type/hello')

        assert response.status_code == 400
        assert response.data == b'Category type not found'


def test_get_category_by_name_success(client, flask_app_mock, mock_get_sqlalchemy, mock_category_object):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.filter_by.return_value.one_or_none.return_value = mock_category_object
        response = client.get('/categories/type/cat1')

        assert response.data == b'1'


def test_get_month_records_success(flask_app_mock, client, mock_get_sqlalchemy, mock_month_record_object,
                                   mock_is_valid_token):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.all.return_value = mock_month_record_object
        response = client.get('/month-records')
        response_object = json.loads(response.data)

        assert response_object["month_records"][0]["id"] == 1
        assert response_object["month_records"][0]["year_num"] == 2024
        assert response_object["month_records"][0]["descr"] == "this is a payment"


def test_get_month_records_post_method_not_allowed(client):
    response = client.post('/month-records')
    assert response.status_code == 405


def test_get_month_stats(flask_app_mock, client, mock_get_sqlalchemy, mock_month_stat_object, mock_is_valid_token):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.all.return_value = mock_month_stat_object
        response = client.get('/month-stats')
        response_object = json.loads(response.data)

        assert response_object["month_stats"][0]["id"] == 1
        assert response_object["month_stats"][0]["year_num"] == 2024
        assert response_object["month_stats"][0]["month_id"] == 2


def test_get_month_stats_post_method_not_allowed(client):
    response = client.post('/month-stats')
    assert response.status_code == 405


def test_get_month_record_by_invalid_year(client, mock_is_valid_token):
    response = client.get('/month-records/year/1/month/JAN')
    assert response.status_code == 400
    assert response.data == b'Invalid year or month parameter'


def test_get_month_record_by_invalid_month(client, mock_is_valid_token):
    response = client.get('/month-records/year/2001/month/MARC')
    assert response.status_code == 400
    assert response.data == b'Invalid year or month parameter'


def test_get_month_record_by_month_and_year_success(client, flask_app_mock, mock_get_sqlalchemy,
                                                    mock_month_object_no_list, mock_month_record_object,
                                                    mock_is_valid_token):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.filter_by.return_value.one_or_none.return_value = mock_month_object_no_list
        mock_get_sqlalchemy.filter_by.return_value.all.return_value = mock_month_record_object
        response = client.get('/month-records/year/2001/month/MAR')
        response_object= json.loads(response.data)

        assert response.status_code == 200
        assert response_object["month_records"][0]['id'] == 1
        assert response_object["month_records"][0]['year_num'] == 2024
        assert response_object["month_records"][0]['amount'] == 25.0

def test_get_month_record_by_id_success(client, flask_app_mock, mock_get_sqlalchemy, mock_month_record_object_no_list,
                                        mock_is_valid_token):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.filter_by.return_value.one_or_none.return_value = mock_month_record_object_no_list
        response = client.get('/month-records/id/2')
        response_object = json.loads(response.data)

        assert response.status_code == 200
        assert response_object["id"] == 2
        assert response_object["amount"] == 150.01


def test_get_month_record_by_id_post_method_not_allowed(client):
    response = client.post('/month-records/id/')
    assert response.status_code == 404


def test_get_month_id_by_name_success(client, flask_app_mock, mock_month_object_no_list, mock_get_sqlalchemy,
                                      mock_is_valid_token):
    with flask_app_mock.app_context():
        mock_get_sqlalchemy.filter_by.return_value.one_or_none.return_value = mock_month_object_no_list
        response = client.get('/months/name/JAN')

        assert response.data == b'1'


def test_get_month_id_by_name_post_method_not_allowed(client):
    response = client.post('/months/name/abc')
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
        response = client.get('/month-records-uncategorized')
        response_object = json.loads(response.data)

        assert response_object["month_records"][0]["id"] == 1
        assert response_object["month_records"][1]["id"] == 2
        assert response_object["month_records"][0]["amount"] == 55.03
        assert response_object["month_records"][1]["amount"] == 55.33



def test_get_month_records_uncategorized_post_method_not_allowed(client):
    response = client.post('/month-records-uncategorized')
    assert response.status_code == 405


def test_set_record_uncategorized_items_success(client, mock_is_valid_token,
                                                mock_uncategorized_services_set_multiple_record_categories):
    response = client.post('/set_record_categories', json={})
    assert response.status_code == 200
    assert response.data == b'Month records updated: 1'
    mock_uncategorized_services_set_multiple_record_categories.assert_called_with({}, )

def test_ignore_uncategorized_items_success(client, mock_is_valid_token,
                                            mock_uncategorized_services_ignore_uncategorized_items):
    response = client.post('/ignore-uncategorized-items', json={})
    assert response.status_code == 200
    mock_uncategorized_services_ignore_uncategorized_items.assert_called_with({}, )
