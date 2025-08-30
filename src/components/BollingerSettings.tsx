import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BollingerBandsOptions, BollingerBandsStyle } from '@/lib/types';

interface BollingerSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  options: BollingerBandsOptions;
  style: BollingerBandsStyle;
  onOptionsChange: (options: BollingerBandsOptions) => void;
  onStyleChange: (style: BollingerBandsStyle) => void;
}

export function BollingerSettings({
  isOpen,
  onClose,
  options,
  style,
  onOptionsChange,
  onStyleChange
}: BollingerSettingsProps) {
  const [localOptions, setLocalOptions] = useState(options);
  const [localStyle, setLocalStyle] = useState(style);

  const handleSave = () => {
    onOptionsChange(localOptions);
    onStyleChange(localStyle);
    onClose();
  };

  const handleCancel = () => {
    setLocalOptions(options);
    setLocalStyle(style);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Bollinger Bands Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="inputs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inputs" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Input
                id="length"
                type="number"
                value={localOptions.length}
                onChange={(e) => setLocalOptions(prev => ({
                  ...prev,
                  length: parseInt(e.target.value) || 20
                }))}
                min="1"
                max="200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select
                value={localOptions.source}
                onValueChange={(value: any) => setLocalOptions(prev => ({
                  ...prev,
                  source: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="close">Close</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stddev">StdDev (Multiplier)</Label>
              <Input
                id="stddev"
                type="number"
                step="0.1"
                value={localOptions.stdDev}
                onChange={(e) => setLocalOptions(prev => ({
                  ...prev,
                  stdDev: parseFloat(e.target.value) || 2
                }))}
                min="0.1"
                max="10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="offset">Offset</Label>
              <Input
                id="offset"
                type="number"
                value={localOptions.offset}
                onChange={(e) => setLocalOptions(prev => ({
                  ...prev,
                  offset: parseInt(e.target.value) || 0
                }))}
                min="-50"
                max="50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="matype">MA Type</Label>
              <Select value={localOptions.maType} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMA">SMA</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Only SMA is currently supported</p>
            </div>
          </TabsContent>
          
          <TabsContent value="style" className="space-y-6 mt-4 max-h-[70vh] overflow-y-auto pr-2">
            {/* Upper Band */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Upper Band</Label>
                <Switch
                  checked={localStyle.upper.show}
                  onCheckedChange={(checked) => setLocalStyle(prev => ({
                    ...prev,
                    upper: { ...prev.upper, show: checked }
                  }))}
                />
              </div>
              
              {localStyle.upper.show && (
                <div className="space-y-3 pl-4 border-l-2 border-border">
                  <div className="space-y-2">
                    <Label className="text-xs">Color</Label>
                    <Input
                      type="color"
                      value={localStyle.upper.color}
                      onChange={(e) => setLocalStyle(prev => ({
                        ...prev,
                        upper: { ...prev.upper, color: e.target.value }
                      }))}
                      className="h-8 w-16"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Line Width: {localStyle.upper.lineWidth}</Label>
                    <Slider
                      value={[localStyle.upper.lineWidth]}
                      onValueChange={([value]) => setLocalStyle(prev => ({
                        ...prev,
                        upper: { ...prev.upper, lineWidth: value }
                      }))}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Line Style</Label>
                    <Select
                      value={localStyle.upper.lineStyle}
                      onValueChange={(value: any) => setLocalStyle(prev => ({
                        ...prev,
                        upper: { ...prev.upper, lineStyle: value }
                      }))}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            
            {/* Middle Band (Basis) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Middle Band (Basis)</Label>
                <Switch
                  checked={localStyle.basis.show}
                  onCheckedChange={(checked) => setLocalStyle(prev => ({
                    ...prev,
                    basis: { ...prev.basis, show: checked }
                  }))}
                />
              </div>
              
              {localStyle.basis.show && (
                <div className="space-y-3 pl-4 border-l-2 border-border">
                  <div className="space-y-2">
                    <Label className="text-xs">Color</Label>
                    <Input
                      type="color"
                      value={localStyle.basis.color}
                      onChange={(e) => setLocalStyle(prev => ({
                        ...prev,
                        basis: { ...prev.basis, color: e.target.value }
                      }))}
                      className="h-8 w-16"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Line Width: {localStyle.basis.lineWidth}</Label>
                    <Slider
                      value={[localStyle.basis.lineWidth]}
                      onValueChange={([value]) => setLocalStyle(prev => ({
                        ...prev,
                        basis: { ...prev.basis, lineWidth: value }
                      }))}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Line Style</Label>
                    <Select
                      value={localStyle.basis.lineStyle}
                      onValueChange={(value: any) => setLocalStyle(prev => ({
                        ...prev,
                        basis: { ...prev.basis, lineStyle: value }
                      }))}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            
            {/* Lower Band */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Lower Band</Label>
                <Switch
                  checked={localStyle.lower.show}
                  onCheckedChange={(checked) => setLocalStyle(prev => ({
                    ...prev,
                    lower: { ...prev.lower, show: checked }
                  }))}
                />
              </div>
              
              {localStyle.lower.show && (
                <div className="space-y-3 pl-4 border-l-2 border-border">
                  <div className="space-y-2">
                    <Label className="text-xs">Color</Label>
                    <Input
                      type="color"
                      value={localStyle.lower.color}
                      onChange={(e) => setLocalStyle(prev => ({
                        ...prev,
                        lower: { ...prev.lower, color: e.target.value }
                      }))}
                      className="h-8 w-16"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Line Width: {localStyle.lower.lineWidth}</Label>
                    <Slider
                      value={[localStyle.lower.lineWidth]}
                      onValueChange={([value]) => setLocalStyle(prev => ({
                        ...prev,
                        lower: { ...prev.lower, lineWidth: value }
                      }))}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Line Style</Label>
                    <Select
                      value={localStyle.lower.lineStyle}
                      onValueChange={(value: any) => setLocalStyle(prev => ({
                        ...prev,
                        lower: { ...prev.lower, lineStyle: value }
                      }))}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            
            {/* Background Fill */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Background Fill</Label>
                <Switch
                  checked={localStyle.fill.show}
                  onCheckedChange={(checked) => setLocalStyle(prev => ({
                    ...prev,
                    fill: { ...prev.fill, show: checked }
                  }))}
                />
              </div>
              
              {localStyle.fill.show && (
                <div className="space-y-2 pl-4 border-l-2 border-border">
                  <Label className="text-xs">Opacity: {Math.round(localStyle.fill.opacity * 100)}%</Label>
                  <Slider
                    value={[localStyle.fill.opacity]}
                    onValueChange={([value]) => setLocalStyle(prev => ({
                      ...prev,
                      fill: { ...prev.fill, opacity: value }
                    }))}
                    min={0.05}
                    max={1}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Apply Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}