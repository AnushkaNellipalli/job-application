from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .filters import JobFilter
from .models import Job
from .pagination import JobPagination
from .permissions import IsStaffOrReadOnly
from .serializers import JobListSerializer, JobSerializer
from .utils import similarity_score


class JobViewSet(viewsets.ModelViewSet):
    """
    GET    /api/jobs/                 list (search, filter, order, ?page, ?page_size)   -> Jobs.jsx
    GET    /api/jobs/{id}/            one job in full                          -> JobDetailsCard.jsx
    GET    /api/jobs/{id}/similar/    up to N related jobs                     -> Sidebar "Similar Jobs"
    GET    /api/jobs/recent/          newest N jobs                            -> Sidebar recent list
    POST/PUT/PATCH/DELETE             staff only
    """

    permission_classes = [IsStaffOrReadOnly]
    pagination_class = JobPagination
    filterset_class = JobFilter
    search_fields = ["title", "company", "location"]  # ?search=react
    ordering_fields = ["posted_at", "title", "company"]  # ?ordering=-posted_at
    ordering = ["-posted_at"]

    def get_queryset(self):
        queryset = Job.objects.all()
        user = self.request.user
        if not (user.is_authenticated and user.is_staff):
            queryset = queryset.filter(is_active=True)  # closed postings are hidden from the public
        return queryset

    def get_serializer_class(self):
        if self.action in ("list", "recent", "similar"):
            return JobListSerializer
        return JobSerializer

    @staticmethod
    def _limit(request, default, maximum=20):
        try:
            value = int(request.query_params.get("limit", default))
        except (TypeError, ValueError):
            return default
        return max(1, min(value, maximum))

    @action(detail=False, methods=["get"])
    def recent(self, request):
        jobs = self.get_queryset().order_by("-posted_at", "-id")[: self._limit(request, default=5)]
        return Response(self.get_serializer(jobs, many=True).data)

    @action(detail=True, methods=["get"])
    def similar(self, request, pk=None):
        job = self.get_object()
        candidates = list(self.get_queryset().exclude(pk=job.pk)[:200])
        # sorted() is stable, so equally-similar jobs keep their newest-first order.
        ranked = sorted(candidates, key=lambda other: similarity_score(job, other), reverse=True)
        top = ranked[: self._limit(request, default=3)]
        return Response(self.get_serializer(top, many=True).data)
