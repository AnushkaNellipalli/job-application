"""Small pure functions used by the serializers and views (easy to unit test)."""
import re

from django.utils import timezone


def time_ago(moment, now=None):
    """Turn a datetime into the relative text the UI shows: '2 days ago', '3 weeks ago'."""
    now = now or timezone.now()
    seconds = max(int((now - moment).total_seconds()), 0)

    def plural(n, unit):
        return f"{n} {unit}{'' if n == 1 else 's'} ago"

    if seconds < 60:
        return "Just now"
    minutes = seconds // 60
    if minutes < 60:
        return plural(minutes, "minute")
    hours = minutes // 60
    if hours < 24:
        return plural(hours, "hour")
    days = hours // 24
    if days < 7:
        return plural(days, "day")
    if days < 30:
        return plural(days // 7, "week")
    if days < 365:
        return plural(days // 30, "month")
    return plural(days // 365, "year")


def _words(text):
    return set(re.findall(r"\w+", (text or "").lower()))


def similarity_score(job, other):
    """
    How alike two jobs are. Used for the "Similar Jobs" sidebar.
    Shared skills weigh most, then shared words in the title, then same job type.
    """
    shared_skills = {s.lower() for s in job.skills} & {s.lower() for s in other.skills}
    shared_title_words = _words(job.title) & _words(other.title)
    score = 3 * len(shared_skills) + 2 * len(shared_title_words)
    if job.employment_type == other.employment_type:
        score += 1
    return score
