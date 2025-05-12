import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { getCampaignCommunicationLogs } from '@/lib/crmApi';

const statusColors = {
  queued: 'bg-slate-200 text-slate-800',
  sent: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  opened: 'bg-purple-100 text-purple-800',
  clicked: 'bg-indigo-100 text-indigo-800',
};

const CommunicationLogs = ({ campaignId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getCampaignCommunicationLogs(campaignId, {
        page: pagination.page,
        limit: pagination.limit,
      });
      
      setLogs(data.logs);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (err) {
      console.error('Error fetching communication logs:', err);
      setError('Failed to load communication logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchLogs();
    }
  }, [campaignId, pagination.page, pagination.limit]);

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination({ ...pagination, page: pagination.page - 1 });
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination({ ...pagination, page: pagination.page + 1 });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm:ss');
    } catch (e) {
      return dateString;
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-800">
        <p>{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchLogs} 
          className="mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Communication Logs</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchLogs} 
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>

      {loading && logs.length === 0 ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center p-8 bg-muted rounded-md">
          <p className="text-muted-foreground">No communication logs found</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Delivered</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>
                      <div className="font-medium">
                        {log.userId?.firstName} {log.userId?.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {log.userId?.email || 'Unknown Email'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[log.status] || 'bg-gray-100'}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.metadata?.sentTimestamp 
                        ? formatDate(log.metadata.sentTimestamp) 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {log.metadata?.deliveryTimestamp 
                        ? formatDate(log.metadata.deliveryTimestamp) 
                        : log.status === 'failed' 
                          ? <span className="text-red-500">Failed</span>
                          : 'Pending'}
                    </TableCell>
                    <TableCell>
                      {log.status === 'failed' && log.metadata?.failureReason ? (
                        <span className="text-red-500 text-xs">
                          {log.metadata.failureReason}
                        </span>
                      ) : log.status === 'delivered' ? (
                        <span className="text-green-500 text-xs">
                          Delivered successfully
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {log.metadata?.vendorMessageId || 'No details'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {logs.length} of {pagination.total} logs
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={pagination.page >= pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CommunicationLogs; 