from rest_framework.pagination import PageNumberPagination


class JobPagination(PageNumberPagination):
    """Default 12 jobs per page; the client may ask for more with ?page_size=N (max 50)."""

    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50
