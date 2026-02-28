# @torchui/solid

A modern, accessible SolidJS component library built with Tailwind CSS and Kobalte.

## Installation

```bash
npm install @torchui/solid
```

## Usage

```jsx
import { Button, Input, Card } from '@torchui/solid';

function App() {
  return (
    <Card>
      <Input placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

## Features

- **Beautiful Design** - Modern, clean components with Tailwind CSS
- **Accessible** - Built with Kobalte for full accessibility support
- **Customizable** - Extensive theming and variant system
- **Responsive** - Mobile-first design approach
- **Dark Mode** - Built-in dark mode support
- **Performance** - Lightweight and fast

## Components

### Actions
- Button, ButtonGroup, Link, Copy

### Forms
- Input, TextArea, Select, Checkbox, Switch, RadioGroup
- NumberField, Slider, DatePicker, ColorPicker, FileUpload
- Autocomplete, MultiSelect, CodeInput

### Layout
- Card, Grid, Container, Section, Divider
- Accordion, Collapsible, Form, FormActions

### Overlays
- Dialog, Drawer, Popover, Tooltip, AlertDialog, ContextMenu

### Navigation
- Tabs, Breadcrumbs, DropdownMenu, Pagination, ViewSwitcher

### Data Display
- Table, DataTable, Image, Avatar, AvatarGroup, Badge, Tag
- Persona, StatCard, EmptyState, Carousel, ColorSwatch

### Feedback
- Loading, Progress, Skeleton, Toast, PasswordStrengthIndicator

### Typography
- Code, Icon

### Charts
- Chart, Sparkline

## Documentation

For full documentation and examples, visit: https://torch-ui.dev

## Requirements

- **SolidJS** ^1.9.0 (peer dependency)
- **Tailwind CSS** v4 with matching theme tokens

## License

MIT © Sean Dowd
