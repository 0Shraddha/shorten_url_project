import time
from collections import defaultdict

RATE_LIMIT = 5        # 5 requests
WINDOW_SIZE = 60      # per 60 seconds

# Structure:
# { ip_address: [timestamps] }
request_logs = defaultdict(list)


def is_rate_limited(ip):
    now = time.time()
    window_start = now - WINDOW_SIZE

    # Remove old timestamps
    request_logs[ip] = [
        timestamp for timestamp in request_logs[ip]
        if timestamp > window_start
    ]

    if len(request_logs[ip]) >= RATE_LIMIT:
        oldest_request = min(request_logs[ip])
        retry_after = WINDOW_SIZE - (now - oldest_request)
        return True, int(retry_after)

    request_logs[ip].append(now)
    return False, 0
