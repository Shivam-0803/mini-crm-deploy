import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, ArrowRight, Users, Mail, MessageSquare, Bell, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign, previewAudienceSize } from '@/lib/crmApi';
import RuleBuilder from '@/components/RuleBuilder';
import AudiencePreview from '@/components/AudiencePreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Progress } from "@/components/ui/progress";
import AIMessageSuggestions from '@/components/AIMessageSuggestions';

const getCampaignTypeIcon = (type) => {
  switch(type) {
    case 'Email':
      return <Mail className="h-4 w-4" />;
    case 'SMS':
      return <MessageSquare className="h-4 w-4" />;
    case 'Push':
      return <Bell className="h-4 w-4" />;
    default:
      return <Mail className="h-4 w-4" />;
  }
};

const CampaignForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState('Email');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState('details');
  const [segmentRules, setSegmentRules] = useState({ 
    operator: 'AND', 
    conditions: [{ type: 'spend', operator: '>', value: '10000' }] 
  });
  const [showAudiencePreview, setShowAudiencePreview] = useState(false);
  const [audienceSize, setAudienceSize] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  
  useEffect(() => {
    // Calculate form progress based on filled fields and active tab
    let progress = 0;
    if (name) progress += 20;
    if (type) progress += 10;
    
    if (currentTab === 'audience' || currentTab === 'content') {
      progress += 20;
      if (audienceSize) progress += 10;
    }
    
    if (currentTab === 'content') {
      progress += 10;
      if (subject) progress += 10;
      if (content) progress += 20;
    }
    
    setFormProgress(progress);
  }, [name, type, subject, content, currentTab, audienceSize]);
  
  const handleSegmentRulesChange = (rules) => {
    setSegmentRules(rules);
  };
  
  const handleAudiencePreview = async () => {
    setShowAudiencePreview(true);
    try {
      // Show loading toast
      const toastId = toast.loading('Calculating audience size...');
      
      const data = await previewAudienceSize(segmentRules);
      setAudienceSize(data.audienceSize);
      
      // Update toast
      toast.success(`Audience size: ${data.audienceSize} customers`, { id: toastId });
    } catch (err) {
      console.error('Error previewing audience size:', err);
      toast.error('Failed to calculate audience size');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      toast.error('Campaign name is required');
      setCurrentTab('details');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Campaign content is required');
      setCurrentTab('content');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Show loading toast
    const toastId = toast.loading('Creating your campaign...');
    
    try {
      // If we don't have audience size yet, try to get it
      if (!audienceSize) {
        try {
          const data = await previewAudienceSize(segmentRules);
          setAudienceSize(data.audienceSize);
        } catch (err) {
          console.error('Error previewing audience size:', err);
        }
      }
      
      const campaignData = {
        name,
        type,
        content: { 
          subject: subject,
          body: content 
        },
        status: 'draft',
        segmentRules,
        audienceSize: audienceSize || 0
      };
      
      console.log('Submitting campaign:', campaignData);
      
      // Use the imported createCampaign function instead of direct axios call
      const response = await createCampaign(campaignData);
      
      console.log('Campaign created:', response);
      
      setLoading(false);
      toast.success('Campaign created successfully!', { id: toastId });
      
      // Use setTimeout to allow the toast to be visible before navigating
      setTimeout(() => {
        navigate(`/campaign-history?campaign=${response._id}`);
      }, 1000);
    } catch (err) {
      console.error('Failed to create campaign:', err);
      
      setLoading(false);
      
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setError('Network error: Cannot connect to server. Make sure your backend server is running.');
        toast.error('Network error: Cannot connect to server', { id: toastId });
      } else if (err.response) {
        setError(`Server error: ${err.response.data?.error?.message || err.response.statusText}`);
        toast.error(`Server error: ${err.response.status}`, { id: toastId });
      } else {
        setError(`Error: ${err.message}`);
        toast.error(`Error: ${err.message}`, { id: toastId });
      }
    }
  };
  
  const getTemplateContent = (templateType) => {
    if (templateType === 'welcome') {
      setSubject('Welcome to our community!');
      setContent('Dear customer,\n\nWelcome to our community! We\'re thrilled to have you with us.\n\nHere are some resources to get started:\n- Check out our latest products\n- Join our loyalty program\n- Follow us on social media\n\nBest regards,\nThe Team');
    } else if (templateType === 'promo') {
      setSubject('Special offer just for you!');
      setContent('Dear valued customer,\n\nWe\'re excited to offer you an exclusive discount on our premium products!\n\nUse code SPECIAL20 at checkout to get 20% off your next purchase.\n\nDon\'t miss out - this offer expires in 7 days.\n\nBest regards,\nThe Team');
    } else if (templateType === 'announcement') {
      setSubject('Important announcement');
      setContent('Dear customer,\n\nWe\'re excited to announce some important updates to our services.\n\nStarting next month, we\'ll be introducing new features that will enhance your experience with us.\n\nStay tuned for more information!\n\nBest regards,\nThe Team');
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <Progress value={formProgress} className="h-2" />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Campaign details</span>
          <span>Audience targeting</span>
          <span>Content creation</span>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex gap-2 items-center">
            <CheckCircle className={`h-4 w-4 ${name ? 'text-green-500' : 'text-muted-foreground'}`} />
            Campaign Details
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex gap-2 items-center">
            <CheckCircle className={`h-4 w-4 ${audienceSize ? 'text-green-500' : 'text-muted-foreground'}`} />
            Audience Targeting
          </TabsTrigger>
          <TabsTrigger value="content" className="flex gap-2 items-center">
            <CheckCircle className={`h-4 w-4 ${content ? 'text-green-500' : 'text-muted-foreground'}`} />
            Content
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter campaign name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Campaign Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="SMS">
                    <div className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      SMS
                    </div>
                  </SelectItem>
                  <SelectItem value="Push">
                    <div className="flex items-center">
                      <Bell className="mr-2 h-4 w-4" />
                      Push Notification
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              type="button" 
              variant="default" 
              onClick={() => setCurrentTab('audience')}
              className="w-full mt-2"
              disabled={!name.trim()}
            >
              Next: Define Audience
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-muted p-4 rounded-md mb-4">
              <h3 className="text-lg font-medium mb-2">Audience Targeting</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Define who should receive this campaign by creating segment rules.
              </p>
              
              <RuleBuilder 
                value={segmentRules} 
                onChange={handleSegmentRulesChange} 
                onAudiencePreview={handleAudiencePreview}
              />
            </div>
            
            {audienceSize !== null && (
              <div className="bg-green-50 border border-green-100 p-3 rounded-md text-green-800 flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                <div>
                  <p className="font-medium">Audience Size: {audienceSize} customers</p>
                  <p className="text-sm text-green-700">This campaign will target {audienceSize} customers based on your segment rules.</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCurrentTab('details')}
              >
                Back
              </Button>
              
              <Button 
                type="button" 
                variant="default" 
                onClick={() => setCurrentTab('content')}
              >
                Next: Create Content
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <AudiencePreview 
              open={showAudiencePreview} 
              onOpenChange={setShowAudiencePreview} 
              segmentRules={segmentRules}
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-slate-50 p-4 rounded-lg border mb-6">
              <AIMessageSuggestions
                objective={name}
                audience={`Segment with ${audienceSize || 0} customers`}
                onSelectMessage={(message) => {
                  setSubject(message.subject);
                  setContent(message.body);
                }}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">or use templates</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              <Label className="w-full text-sm font-medium text-muted-foreground mb-0">Quick templates:</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => getTemplateContent('welcome')}>
                Welcome Email
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => getTemplateContent('promo')}>
                Promotion
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => getTemplateContent('announcement')}>
                Announcement
              </Button>
            </div>
            
            {type === "Email" && (
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject line"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="content">Campaign Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your campaign message here..."
                className="min-h-[200px]"
                required
              />
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCurrentTab('audience')}
              >
                Back
              </Button>
              
              <Button 
                type="submit" 
                disabled={loading}
                onClick={handleSubmit}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Create Campaign
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      {error && (
        <div className="text-red-500 mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <div className="text-sm">{error}</div>
        </div>
      )}
    </div>
  );
};

const Campaigns = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold">Create Campaign</h1>
      <p className="mt-2 text-muted-foreground mb-6">Create a new marketing campaign to engage with your audience</p>
      
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 shadow-md">
          <CardHeader className="bg-slate-50">
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              New Campaign
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <CampaignForm />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Campaigns; 