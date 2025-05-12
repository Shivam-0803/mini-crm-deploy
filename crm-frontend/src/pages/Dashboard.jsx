import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Users,
  Mail,
  TrendingUp,
  Clock,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  UserPlus,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Activity,
  Sparkles,
  Users2,
  MessageSquare,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import api from '@/lib/api';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4560', '#775DD0'];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Stat card component with animation
const StatCard = ({ title, value, description, icon: Icon, trend, color }) => {
  const isPositive = trend > 0;
  
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
          <div className={`p-2 rounded-full bg-muted`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-bold text-foreground">{value}</div>
          <div className="flex items-center mt-1">
            <p className="text-xs text-muted-foreground">{description}</p>
            {trend && (
              <div className={`flex items-center ml-2 text-xs font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isPositive ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      title: 'Total Segments',
      value: '0',
      icon: Users2,
      description: 'Active audience segments',
      trend: 0,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Active Campaigns',
      value: '0',
      icon: Mail,
      description: 'Running marketing campaigns',
      trend: 0,
      color: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Engagement Rate',
      value: '0%',
      icon: Activity,
      description: 'Average campaign engagement',
      trend: 0,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Response Time',
      value: '0h',
      icon: Clock,
      description: 'Average response time',
      trend: 0,
      color: 'text-amber-600 dark:text-amber-400',
    },
  ]);

  const [campaignPerformance, setCampaignPerformance] = useState([]);
  const [audienceGrowth, setAudienceGrowth] = useState([]);
  const [campaignTypeData, setCampaignTypeData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch segments count
        const segmentsResponse = await api.get('/api/segments');
        const segments = segmentsResponse.data;
        
        // Fetch campaigns
        const campaignsResponse = await api.get('/api/campaigns');
        const campaigns = campaignsResponse.data;
        
        // Calculate active campaigns
        const activeCampaigns = campaigns.filter(c => c.status === 'active');
        
        // Calculate average engagement rate
        const totalEngagement = campaigns.reduce((sum, campaign) => {
          const { opened, sent } = campaign.metrics || { opened: 0, sent: 0 };
          // Avoid division by zero
          return sum + (sent > 0 ? (opened / sent) * 100 : 0);
        }, 0);
        const avgEngagement = campaigns.length > 0 
          ? (totalEngagement / campaigns.length).toFixed(1) 
          : '0.0';
        
        // Generate mock trends (in a real app, these would come from historical data)
        const segmentTrend = Math.floor(Math.random() * 20) - 5; // -5 to +15
        const campaignTrend = Math.floor(Math.random() * 25); // 0 to +25
        const engagementTrend = Math.floor(Math.random() * 10) - 3; // -3 to +7
        const responseTrend = Math.floor(Math.random() * 10) - 5; // -5 to +5
        
        // Update stats
        setStats([
          {
            title: 'Total Segments',
            value: segments.length.toString(),
            icon: Users2,
            description: 'Active audience segments',
            trend: segmentTrend,
            color: 'text-blue-600 dark:text-blue-400',
          },
          {
            title: 'Active Campaigns',
            value: activeCampaigns.length.toString(),
            icon: Mail,
            description: 'Running marketing campaigns',
            trend: campaignTrend,
            color: 'text-indigo-600 dark:text-indigo-400',
          },
          {
            title: 'Engagement Rate',
            value: `${avgEngagement}%`,
            icon: Activity,
            description: 'Average campaign engagement',
            trend: engagementTrend,
            color: 'text-green-600 dark:text-green-400',
          },
          {
            title: 'Response Time',
            value: '2.4h', // Hardcoded for now, could be calculated from response data
            icon: Clock,
            description: 'Average response time',
            trend: responseTrend,
            color: 'text-amber-600 dark:text-amber-400',
          },
        ]);
        
        // Prepare campaign performance data for chart
        const performanceData = campaigns
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(campaign => ({
            name: campaign.name.substring(0, 12) + (campaign.name.length > 12 ? '...' : ''),
            sent: campaign.metrics?.sent || 0,
            opened: campaign.metrics?.opened || 0,
            clicked: campaign.metrics?.clicked || 0,
          }))
          .slice(0, 5); // Take only the 5 most recent campaigns
        
        setCampaignPerformance(performanceData);
        
        // Generate more realistic audience growth data
        const currentMonth = new Date().getMonth();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const last6Months = Array.from({length: 6}, (_, i) => {
          const monthIndex = (currentMonth - 5 + i + 12) % 12; // Ensure we wrap around for beginning of year
          return monthNames[monthIndex];
        });
        
        // Generate sample data that starts from ~300 and grows to ~800 with some variation
        const audienceGrowthData = [];
        let baseValue = 300;
        for (let i = 0; i < 6; i++) {
          // Add some growth plus random variation
          baseValue = baseValue + (baseValue * 0.1) + (Math.random() * 30 - 5);
          audienceGrowthData.push({
            month: last6Months[i],
            customers: Math.round(baseValue),
            newCustomers: Math.round(baseValue * 0.12 + Math.random() * 15),
          });
        }
        setAudienceGrowth(audienceGrowthData);
        
        // Prepare campaign type distribution
        const campaignTypes = {};
        campaigns.forEach(campaign => {
          const type = campaign.type || 'Other';
          const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
          campaignTypes[formattedType] = (campaignTypes[formattedType] || 0) + 1;
        });
        
        const typeData = Object.keys(campaignTypes).map(type => ({
          name: type,
          value: campaignTypes[type]
        }));
        
        setCampaignTypeData(typeData);
        
        // Generate mock recent activity
        const activityTypes = ['Created segment', 'Sent campaign', 'Updated campaign', 'New subscriber'];
        const activityIcons = [Users, Mail, Sparkles, UserPlus];
        const sampleNames = ['High-value customers', 'Monthly newsletter', 'Abandoned cart', 'New products announcement', 'Holiday special'];
        
        const recentActivityData = Array.from({length: 5}, (_, i) => {
          const activityIndex = Math.floor(Math.random() * activityTypes.length);
          return {
            id: i,
            type: activityTypes[activityIndex],
            icon: activityIcons[activityIndex],
            name: sampleNames[Math.floor(Math.random() * sampleNames.length)],
            time: `${Math.floor(Math.random() * 24)}h ago`,
          };
        });
        
        setRecentActivity(recentActivityData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    
    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  // Chart components
  const CampaignPerformanceChart = () => (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className="h-[350px]"
    >
      {campaignPerformance.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={campaignPerformance}
            margin={{ top: 10, right: 30, left: 10, bottom: 60 }}
          >
            <defs>
              <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="openedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="clickedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ffc658" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60} 
              tick={{ fontSize: 12 }}
              stroke="#888"
            />
            <YAxis stroke="#888" tick={{ fontSize: 12 }} />
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: "rgba(255, 255, 255, 0.95)", 
                borderRadius: "8px", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
                border: "none" 
              }} 
            />
            <Legend wrapperStyle={{ paddingTop: 15 }} />
            <Bar 
              dataKey="sent" 
              name="Sent" 
              fill="url(#sentGradient)" 
              radius={[4, 4, 0, 0]}
              barSize={25}
              animationDuration={1500}
            />
            <Bar 
              dataKey="opened" 
              name="Opened" 
              fill="url(#openedGradient)"
              radius={[4, 4, 0, 0]}
              barSize={25}
              animationDuration={1500}
            />
            <Bar 
              dataKey="clicked" 
              name="Clicked" 
              fill="url(#clickedGradient)"
              radius={[4, 4, 0, 0]}
              barSize={25}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <BarChart3 className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <p>No campaign data available</p>
            <Button variant="outline" size="sm" className="mt-4">
              Create your first campaign
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );

  const AudienceGrowthChart = () => (
    <motion.div 
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className="h-[350px]"
    >
      {audienceGrowth.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={audienceGrowth}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNewCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#888" tick={{ fontSize: 12 }} />
            <YAxis stroke="#888" tick={{ fontSize: 12 }} />
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: "rgba(255, 255, 255, 0.95)", 
                borderRadius: "8px", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
                border: "none" 
              }} 
            />
            <Legend wrapperStyle={{ paddingTop: 15 }} />
            <Area 
              type="monotone" 
              dataKey="customers" 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#colorCustomers)" 
              name="Total Customers"
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey="newCustomers" 
              stroke="#82ca9d" 
              fillOpacity={1} 
              fill="url(#colorNewCustomers)" 
              name="New Customers"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <LineChartIcon className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <p>No audience growth data available</p>
          </div>
        </div>
      )}
    </motion.div>
  );

  const CampaignTypeChart = () => (
    <motion.div 
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className="h-[350px]"
    >
      {campaignTypeData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={campaignTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              animationDuration={1500}
              animationBegin={300}
            >
              {campaignTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip 
              contentStyle={{ 
                backgroundColor: "rgba(255, 255, 255, 0.95)", 
                borderRadius: "8px", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
                border: "none" 
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <PieChartIcon className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <p>No campaign type data available</p>
          </div>
        </div>
      )}
    </motion.div>
  );

  const RecentActivityList = () => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 h-[350px] overflow-y-auto px-1 py-2"
    >
      {recentActivity.length > 0 ? (
        recentActivity.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: activity.id * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 transition-colors"
          >
            <div className={`p-2 rounded-full bg-slate-100`}>
              <activity.icon className="h-4 w-4 text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.type}</p>
              <p className="text-xs text-muted-foreground">{activity.name}</p>
            </div>
            <div className="text-xs text-muted-foreground">{activity.time}</div>
          </motion.div>
        ))
      ) : (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Activity className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <p>No recent activity found</p>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 pb-16"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Badge variant="outline" className="mb-2 text-indigo-600 border-indigo-200 px-3 py-1">Dashboard</Badge>
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back to Mini CRM</h1>
            <div className="flex items-center space-x-2">
              {/* ... rest of the code ... */}
            </div>
          </div>
          <p className="mt-2 text-muted-foreground">
            Get a quick overview of your marketing performance and audience growth
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Charts */}
          <div>
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="audience" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Audience
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Activity className="h-4 w-4 mr-2" />
                    Activity
                  </TabsTrigger>
                </TabsList>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 gap-1 bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Quick insights</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get AI-powered insights from your data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <AnimatePresence mode="wait">
                <TabsContent value="overview" className="grid gap-4 md:grid-cols-2">
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-0 pt-6">
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-indigo-500" />
                        Campaign Performance
                      </CardTitle>
                      <CardDescription>
                        Email open and click rates for recent campaigns
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pt-4">
                      {loading ? (
                        <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                      ) : (
                        <CampaignPerformanceChart />
                      )}
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <CardHeader className="pb-0 pt-6">
                      <CardTitle className="flex items-center">
                        <PieChartIcon className="h-5 w-5 mr-2 text-indigo-500" />
                        Campaign Distribution
                      </CardTitle>
                      <CardDescription>
                        Breakdown of campaign types in your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pt-4">
                      {loading ? (
                        <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                      ) : (
                        <CampaignTypeChart />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="audience" className="grid gap-4 md:grid-cols-1">
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-0 pt-6">
                      <CardTitle className="flex items-center">
                        <LineChartIcon className="h-5 w-5 mr-2 text-indigo-500" />
                        Audience Growth
                      </CardTitle>
                      <CardDescription>
                        Monthly growth in customer base and new sign-ups
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pt-4">
                      {loading ? (
                        <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                      ) : (
                        <AudienceGrowthChart />
                      )}
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Users2 className="h-4 w-4 mr-2 text-indigo-500" />
                          Customer Segments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {stats[0].value === '0' ? (
                            <div className="text-center py-6">
                              <p className="text-muted-foreground">No segments created yet</p>
                            </div>
                          ) : (
                            <>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">High-value customers</span>
                                  <span className="text-sm font-medium">34%</span>
                                </div>
                                <Progress value={34} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Active users</span>
                                  <span className="text-sm font-medium">27%</span>
                                </div>
                                <Progress value={27} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">New customers</span>
                                  <span className="text-sm font-medium">19%</span>
                                </div>
                                <Progress value={19} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Inactive users</span>
                                  <span className="text-sm font-medium">20%</span>
                                </div>
                                <Progress value={20} className="h-2" />
                              </div>
                            </>
                          )}
                        </div>

                        <Button variant="outline" className="w-full mt-6" size="sm">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          View all segments
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-indigo-500" />
                          Engagement Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Open Rate</p>
                            <p className="text-2xl font-bold mt-1">24.5%</p>
                            <div className="flex items-center mt-1 text-xs text-green-600">
                              <ChevronUp className="h-3 w-3" /> 3.2%
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Click Rate</p>
                            <p className="text-2xl font-bold mt-1">12.8%</p>
                            <div className="flex items-center mt-1 text-xs text-green-600">
                              <ChevronUp className="h-3 w-3" /> 1.5%
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Conversion</p>
                            <p className="text-2xl font-bold mt-1">8.3%</p>
                            <div className="flex items-center mt-1 text-xs text-red-600">
                              <ChevronDown className="h-3 w-3" /> 0.8%
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Bounce Rate</p>
                            <p className="text-2xl font-bold mt-1">2.1%</p>
                            <div className="flex items-center mt-1 text-xs text-green-600">
                              <ChevronDown className="h-3 w-3" /> 0.5%
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="activity">
                  <Card>
                    <CardHeader className="pb-0 pt-6">
                      <CardTitle className="flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-indigo-500" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>
                        Latest actions and updates in your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                      ) : (
                        <RecentActivityList />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard; 