from threading import local
from rest_framework_simplejwt.authentication import JWTAuthentication

# Thread-local storage to hold the user for the duration of the request
_user = local()


class AuditLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        if hasattr(request, 'user') and request.user.is_authenticated:
            _user.value = request.user

        else:
            header = request.META.get('HTTP_AUTHORIZATION', None)

            if header:
                try:
                    jwt_auth = JWTAuthentication()
                    auth_result = jwt_auth.authenticate(request)

                    if auth_result:
                        user, token = auth_result
                        _user.value = user
                    else:
                        _user.value = None
                except Exception as e:
                    _user.value = None
            else:
                _user.value = None

        response = self.get_response(request)

        _user.value = None

        return response


def get_current_user():
    return getattr(_user, 'value', None)