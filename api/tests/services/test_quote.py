from stock.services.quote import QuoteService


def test_list_realtime_quotes():
    quote_service = QuoteService()
    assert len(quote_service.list_realtime_quotes(["MSFT", "GOOG"])) == 2
    assert len(quote_service.list_realtime_quotes(["MSFT"])) == 1
    assert len(quote_service.list_realtime_quotes([])) == 0


# TODO test list realtime quotes with bad symbols argument
# TODO single symbol
# TODO not exist symbol
# TODO symbol need be trim


def test_list_realtime_quotes2():
    quote_service = QuoteService()
    assert len(quote_service.list_realtime_quotes2(["MSFT", "GOOG"])) == 0
