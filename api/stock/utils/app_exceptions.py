from fastapi import HTTPException, Request
from starlette.responses import JSONResponse


class AppException(HTTPException):
    """
    Application Exception
    """

    def __init__(self, status_code: int = 500, context: dict = {}):
        context["status"] = status_code
        super(AppException, self).__init__(status_code=status_code, detail=context)


class NotFoundException(AppException):
    """
    Item not found
    """

    code = "NOT_FOUND"
    context: dict[str, int | str] = {}

    def __init__(
        self,
        resource: str | None = None,
        id: int | str | None = None,
        context: dict = {},
    ):
        self.context = {"resource": "XXX", "code": self.code}
        if id:
            self.context["id"] = id
        if resource:
            self.context["resource"] = resource
        if len(context) > 0:
            self.context = self.context | context

        super(NotFoundException, self).__init__(status_code=404, context=self.context)


async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(status_code=exc.status_code, content=exc.detail)
