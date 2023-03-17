from stock.utils.app_exceptions import NotFoundException


def test_not_found_exception():
    ex = NotFoundException()
    assert ex.status_code == 404
    assert ex.context["status"] == 404
    assert ex.context["code"] == "NOT_FOUND"


def test_not_found_exception_full():
    ex = NotFoundException(
        resource="Trade", id=1, context={"message": "Trade@1 not found"}
    )
    assert ex.status_code == 404
    assert ex.context["status"] == 404
    assert ex.context["code"] == "NOT_FOUND"
    assert ex.context["resource"] == "Trade"
    assert ex.context["id"] == 1
    assert ex.context["message"] == "Trade@1 not found"
