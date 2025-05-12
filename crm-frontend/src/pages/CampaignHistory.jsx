import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Calendar, 
  Users, 
  Mail, 
  XCircle, 
  ArrowLeft, 
  BarChart3, 
  FileDown,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Send,
  ChevronDown,
  RefreshCw,
  Play,
  Trash,
  MoreHorizontal,
  Pencil,
  Pause,
  Bell,
  MessageSquare
} from 'lucide-react';
import { getCampaigns, deleteCampaign } from '@/lib/crmApi';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import CommunicationLogs from '@/components/CommunicationLogs';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const DeliveryStats = ({ metrics, audienceSize }) => {
  // Calculate stats
  const sent = metrics?.sent || 0;
  const delivered = metrics?.delivered || 0;
  const bounced = metrics?.bounced || 0;
  const opened = metrics?.opened || 0;
  const clicked = metrics?.clicked || 0;
  
  // Calculate success rate
  const deliveryRate = sent > 0 ? Math.round((delivered / sent) * 100) : 0;
  const failureRate = sent > 0 ? Math.round((bounced / sent) * 100) : 0;
  const openRate = delivered > 0 ? Math.round((opened / delivered) * 100) : 0;
  const clickRate = opened > 0 ? Math.round((clicked / opened) * 100) : 0;
  
  return (
    <div className="space-y-4">
      {/* Delivery Summary */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Delivery Summary
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Audience Size</span>
            <span className="text-xl font-bold">{audienceSize || sent}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Successfully Sent</span>
            <div className="flex items-center">
              <span className="text-xl font-bold text-green-600">{delivered}</span>
              <span className="text-xs ml-1 text-green-600">({deliveryRate}%)</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Failed Delivery</span>
            <div className="flex items-center">
              <span className="text-xl font-bold text-red-500">{bounced}</span>
              <span className="text-xs ml-1 text-red-500">({failureRate}%)</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Engagement</span>
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-500">{opened}</span>
              <span className="text-xs ml-1 text-blue-500">({openRate}%)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delivery Progress */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Delivery Rate</span>
            <div className="flex items-center">
              <span className="font-medium">{deliveryRate}%</span>
              <span className="inline-flex ml-1">
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              </span>
            </div>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-green-500 transition-all" style={{ width: `${deliveryRate}%` }} />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Failed Delivery Rate</span>
            <div className="flex items-center">
              <span className="font-medium">{failureRate}%</span>
              <span className="inline-flex ml-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              </span>
            </div>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-red-500 transition-all" style={{ width: `${failureRate}%` }} />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Open Rate</span>
            <span className="font-medium">{openRate}%</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${openRate}%` }} />
          </div>
        </div>
      </div>
      
      {/* Download Stats Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="flex items-center">
          <FileDown className="h-3.5 w-3.5 mr-1" />
          Download Stats
        </Button>
      </div>
    </div>
  );
};

const CampaignSkeleton = () => (
  <div className="mb-4">
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-[200px] rounded-md" />
        </div>
      </CardContent>
    </Card>
  </div>
);

const CampaignCard = ({ campaign, isHighlighted, onRefresh }) => {
  const [isExpanded, setIsExpanded] = useState(isHighlighted);
  const navigate = useNavigate();
  
  const getStatusColor = (status) => {
    const statusColors = {
      draft: 'bg-secondary text-secondary-foreground',
      scheduled: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
      active: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
      completed: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100',
      cancelled: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
      paused: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
    };
    return statusColors[status] || 'bg-secondary text-secondary-foreground';
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };
  
  const formatSegmentRules = (rules) => {
    if (!rules || !rules.conditions || rules.conditions.length === 0) return 'No rules found';
    
    return (
      <div className="space-y-1">
        {rules.conditions.map((condition, idx) => {
          // Check if this is a nested rule group
          if (condition.operator && condition.conditions) {
            return (
              <div key={idx} className="pl-2 border-l-2 border-dotted border-slate-300">
                <div className="font-medium text-xs uppercase text-slate-500 mb-1">
                  Group ({condition.operator})
                </div>
                <div className="pl-2">
                  {formatSegmentRules(condition)}
                </div>
                {idx < rules.conditions.length - 1 && (
                  <div className="my-1 font-medium text-primary">{rules.operator}</div>
                )}
              </div>
            );
          }
          
          // This is a simple condition
          const typeLabels = {
            spend: 'Total Spend',
            visits: 'Number of Visits',
            inactive: 'Inactive for Days',
            purchases: 'Number of Purchases',
            location: 'Location'
          };
          
          const operatorLabels = {
            '>': 'greater than',
            '<': 'less than',
            '=': 'equal to',
            '>=': 'greater than or equal to',
            '<=': 'less than or equal to',
            'contains': 'contains'
          };
          
          return (
            <div key={idx}>
              <span className="font-medium">{typeLabels[condition.type] || condition.type}</span>
              {" "}
              <span>{operatorLabels[condition.operator] || condition.operator}</span>
              {" "}
              <span className="font-medium">{condition.value}</span>
              {idx < rules.conditions.length - 1 && (
                <span className="mx-2 font-bold text-primary">{rules.operator}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  const handleDeleteCampaign = async () => {
    if (!window.confirm(`Are you sure you want to delete campaign "${campaign.name}"?`)) {
      return;
    }
    
    const toastId = toast.loading('Deleting campaign...');
    
    try {
      await deleteCampaign(campaign._id || campaign.id);
      toast.success('Campaign deleted successfully', { id: toastId });
      onRefresh();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign', { id: toastId });
    }
  };
  
  const handleEditCampaign = () => {
    navigate(`/campaigns/edit/${campaign._id || campaign.id}`);
  };
  
  const handlePauseCampaign = () => {
    toast.success('Campaign paused successfully');
    onRefresh();
  };
  
  const handleResumeCampaign = () => {
    toast.success('Campaign resumed successfully');
    onRefresh();
  };
  
  const getCampaignTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'push':
        return <Bell className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 ${isHighlighted ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-background rounded-lg' : ''}`}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-2">
              <div className="mt-1">
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {campaign.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center">
                    {getCampaignTypeIcon(campaign.type)}
                    <span className="ml-1">{campaign.type?.charAt(0).toUpperCase() + campaign.type?.slice(1)}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {formatDate(campaign.createdAt)}
                </div>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEditCampaign}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Campaign
                    </DropdownMenuItem>
                    
                    {campaign.status === 'active' ? (
                      <DropdownMenuItem onClick={handlePauseCampaign}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Campaign
                      </DropdownMenuItem>
                    ) : campaign.status === 'paused' ? (
                      <DropdownMenuItem onClick={handleResumeCampaign}>
                        <Play className="h-4 w-4 mr-2" />
                        Resume Campaign
                      </DropdownMenuItem>
                    ) : null}
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={handleDeleteCampaign}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Campaign
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent>
                <div className="space-y-6">
                  {/* Stats Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-2xl font-bold">
                        {campaign.metrics?.sent || 0}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center">
                        <Users className="h-3 w-3 mr-1" /> Audience Size
                      </div>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-2xl font-bold">
                        {campaign.metrics?.delivered || 0}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center">
                        <Mail className="h-3 w-3 mr-1" /> Delivered
                      </div>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-2xl font-bold">
                        {campaign.metrics?.opened || 0}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Opened
                      </div>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-2xl font-bold text-red-500">
                        {campaign.metrics?.bounced || 0}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center">
                        <XCircle className="h-3 w-3 mr-1" /> Failed
                      </div>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="overview" className="mt-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="logs">Communication Logs</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4 pt-4">
                      {/* Campaign has metrics - show detailed statistics */}
                      {campaign.metrics?.sent > 0 && (
                        <DeliveryStats 
                          metrics={campaign.metrics}
                          audienceSize={campaign.audienceSize || campaign.metrics.sent}
                        />
                      )}
                      
                      {campaign.segmentRules && campaign.segmentRules.conditions && campaign.segmentRules.conditions.length > 0 && (
                        <div className="mt-4 border-t border-border pt-4">
                          <h4 className="text-sm font-medium mb-2">Audience Targeting</h4>
                          <div className="bg-muted p-2 rounded text-sm">
                            {formatSegmentRules(campaign.segmentRules)}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="logs" className="pt-4">
                      <CommunicationLogs campaignId={campaign._id} />
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

const CampaignHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const queryParams = new URLSearchParams(location.search);
  const highlightedCampaignId = queryParams.get('campaign');

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCampaigns();
        // Sort by createdAt date in descending order (newest first)
        const sortedCampaigns = data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setCampaigns(sortedCampaigns);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError(err.message || 'Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [refreshKey]);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate('/campaigns')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Campaign History</h1>
            <p className="mt-1 text-muted-foreground">View your past campaign performance</p>
          </div>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <CampaignSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <div>
            <p className="font-medium">Error loading campaigns</p>
            <p>{error}</p>
          </div>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-muted rounded-md border"
        >
          <Send className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No campaigns found</p>
          <p className="text-muted-foreground mb-6">Create a new campaign to get started.</p>
          <Button onClick={() => navigate('/campaigns')}>
            <Send className="h-4 w-4 mr-2" />
            Create New Campaign
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence>
          {filteredCampaigns.map((campaign) => (
            <CampaignCard 
              key={campaign._id || campaign.id} 
              campaign={campaign} 
              isHighlighted={highlightedCampaignId === (campaign._id || campaign.id)} 
              onRefresh={handleRefresh}
            />
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default CampaignHistory; 