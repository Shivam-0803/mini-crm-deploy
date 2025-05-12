import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash, Plus, ChevronsRight, GroupIcon, SplitIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const conditionTypes = [
  { value: 'spend', label: 'Total Spend' },
  { value: 'visits', label: 'Number of Visits' },
  { value: 'inactive', label: 'Inactive for Days' },
  { value: 'purchases', label: 'Number of Purchases' },
  { value: 'location', label: 'Location' },
];

const operators = [
  { value: '>', label: 'Greater than' },
  { value: '<', label: 'Less than' },
  { value: '=', label: 'Equal to' },
  { value: '>=', label: 'Greater than or equal' },
  { value: '<=', label: 'Less than or equal' },
  { value: 'contains', label: 'Contains' },
];

// Component to render a single condition or a rule group
const RuleItem = ({ item, index, parentOperator, onChange, onRemove, depth = 0 }) => {
  // If this is a group (has an operator and conditions)
  if (item.operator && item.conditions) {
    return (
      <RuleGroup 
        rule={item} 
        onChange={(newRule) => onChange(index, newRule)} 
        onRemove={onRemove} 
        parentOperator={parentOperator}
        index={index}
        depth={depth}
      />
    );
  }
  
  // Otherwise it's a single condition
  return (
    <div className="flex items-center space-x-2 mb-2">
      {depth > 0 && <ChevronsRight className="h-4 w-4 text-muted-foreground" />}
      
      <Select
        value={item.type}
        onValueChange={(value) => onChange(index, { ...item, type: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue>{item.type ? conditionTypes.find(t => t.value === item.type)?.label : 'Condition'}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {conditionTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={item.operator}
        onValueChange={(value) => onChange(index, { ...item, operator: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue>{item.operator ? operators.find(o => o.value === item.operator)?.label : 'Operator'}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {operators.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="text"
        value={item.value}
        onChange={(e) => onChange(index, { ...item, value: e.target.value })}
        placeholder="Value"
        className="flex-1"
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Component to render a group of rules with its operator
const RuleGroup = ({ rule, onChange, onRemove, parentOperator, index, depth = 0 }) => {
  const handleOperatorChange = (operator) => {
    onChange({ ...rule, operator });
  };

  const handleConditionChange = (conditionIndex, newCondition) => {
    const newConditions = [...rule.conditions];
    newConditions[conditionIndex] = newCondition;
    onChange({ ...rule, conditions: newConditions });
  };

  const handleAddCondition = () => {
    onChange({
      ...rule,
      conditions: [...rule.conditions, { type: 'spend', operator: '>', value: '' }]
    });
  };
  
  const handleAddGroup = () => {
    onChange({
      ...rule,
      conditions: [
        ...rule.conditions, 
        { 
          operator: rule.operator === 'AND' ? 'OR' : 'AND',  // Use opposite operator for nested group
          conditions: [{ type: 'visits', operator: '<', value: '3' }] 
        }
      ]
    });
  };

  const handleRemoveCondition = (conditionIndex) => {
    if (rule.conditions.length <= 1) {
      // If this is the last condition in a group, remove the entire group
      if (onRemove) onRemove(index);
      return;
    }
    
    const newConditions = [...rule.conditions];
    newConditions.splice(conditionIndex, 1);
    onChange({ ...rule, conditions: newConditions });
  };
  
  const isNested = depth > 0;

  return (
    <div className={`space-y-2 ${isNested ? 'border-l-2 pl-3 ml-1 border-dashed border-muted-foreground' : ''}`}>
      {isNested && (
        <div className="flex items-center mb-2">
          <Badge variant={rule.operator === 'AND' ? 'default' : 'secondary'}>
            Group ({rule.operator})
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="ml-auto h-7 w-7 p-0"
          >
            <Trash className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
      
      {!isNested && (
        <div className="flex items-center mb-4">
          <span className="font-medium">Group conditions with:</span>
          <Select value={rule.operator} onValueChange={handleOperatorChange}>
            <SelectTrigger className="w-[120px] ml-2">
              <SelectValue>{rule.operator}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-1">
        {rule.conditions.map((condition, conditionIndex) => (
          <RuleItem
            key={conditionIndex}
            item={condition}
            index={conditionIndex}
            parentOperator={rule.operator}
            onChange={handleConditionChange}
            onRemove={handleRemoveCondition}
            depth={depth + 1}
          />
        ))}
      </div>

      <div className="flex mt-2 space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddCondition}
          className="flex items-center"
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Condition
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddGroup}
          className="flex items-center"
        >
          <GroupIcon className="mr-1 h-3.5 w-3.5" />
          Add Nested Group
        </Button>
      </div>
    </div>
  );
};

const RuleBuilder = ({ value, onChange, onAudiencePreview }) => {
  // Initialize with default values if none provided
  const defaultRule = { 
    operator: 'AND', 
    conditions: [
      { type: 'spend', operator: '>', value: '10000' },
      { 
        operator: 'OR', 
        conditions: [
          { type: 'visits', operator: '<', value: '3' },
          { type: 'inactive', operator: '>', value: '90' }
        ] 
      }
    ]
  };
  
  const [rules, setRules] = useState(value || defaultRule);

  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(rules)) {
      setRules(value);
    }
  }, [value]);

  useEffect(() => {
    if (onChange) {
      onChange(rules);
    }
  }, [rules, onChange]);

  const handleRuleChange = (newRule) => {
    setRules(newRule);
  };

  const isValidRule = (rule) => {
    return rule.conditions.every(condition => {
      if (condition.operator && condition.conditions) {
        return isValidRule(condition);
      }
      return condition.type && condition.operator && condition.value;
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-1">
        <RuleGroup 
          rule={rules}
          onChange={handleRuleChange} 
          parentOperator={null}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={onAudiencePreview}
          disabled={!isValidRule(rules)}
        >
          Preview Audience Size
        </Button>
      </div>
    </div>
  );
};

export default RuleBuilder; 