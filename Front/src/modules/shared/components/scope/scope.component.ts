import { Component, OnInit, Injectable, EventEmitter, Output, Input } from '@angular/core';
import {CollectionViewer, SelectionChange} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { TranslationService } from '../../services';
import { ServerTranslatePipe } from '../../pipes/server-translate.pipe';
import { SmartComponent } from '../../base-components/smart.component';
import { DynamicFlatNode, ScopeItem } from './models/scope.model';
import { FoundationsService } from 'src/modules/admin/services/foundations.service';
import { Foundation } from 'src/modules/admin/models';




@Injectable()
export class DynamicDataSource {

  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] { return this.dataChange.value; }
  set data(value: DynamicFlatNode[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }
  constructor(private treeControl: FlatTreeControl<DynamicFlatNode>,
              private foundationsService: FoundationsService) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this.treeControl.expansionModel.changed.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }
  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicFlatNode, expand: boolean) {
    node.isLoading = true;
    if (expand) {
      this.expandNode(node);
    } else {
      this.collapseNode(node);
    }
  }

  expandNode(node: DynamicFlatNode) {
    const index = this.data.indexOf(node);
    this.foundationsService.getFoundations({parent: node.item.id})
    .subscribe(
      (res) => {
        node.isLoading = false;
        const children = (res.foundations as Foundation[]);
        if (!children || index < 0) { // If no children, or cannot find the node, no op
          return;
        }
        const nodes = this.convertFoundationsToTreeNodes(children);
        this.data.splice(index + 1, 0, ...nodes);
        this.dataChange.next(this.data);

      },
      (err) => {
        node.isLoading = false;
      }
    );
  }

  collapseNode(node: DynamicFlatNode) {
    const index = this.data.indexOf(node);
    node.isLoading = false;
    let count = 0;
    for (let i = index + 1; i < this.data.length
      && this.data[i].level > node.level; i++, count++) {}
    this.data.splice(index + 1, count);
    this.dataChange.next(this.data);
  }

  convertFoundationsToTreeNodes(foundations: Foundation[]) {
    return foundations.map(
      (item) => {
        const treeItem: ScopeItem = {
          id: item._id,
          name: `${item.arName}|${item.enName}`,
          childrenCount: item.childrenCount,
        };
        const level = item.parentTotalId ? item.parentTotalId.split('.').length : 0;
        const expandable = treeItem.childrenCount > 0;
        return new DynamicFlatNode(treeItem, level, expandable);
      }
    );
  }
}



@Component({
  selector: 'acc-scope',
  templateUrl: './scope.component.html',
  styleUrls: ['./scope.component.scss'],
  providers: [FoundationsService]
})
export class ScopeComponent extends SmartComponent implements OnInit {
  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;
  @Input() selectedNodeId: string;
  @Output() nodeClick: EventEmitter<ScopeItem> = new EventEmitter();
  constructor(
    private foundationsService: FoundationsService,
    translationService: TranslationService,
    serverTranslatePipe: ServerTranslatePipe,
  ) {
    super(translationService, serverTranslatePipe);

  }
  ngOnInit() {
    this.init();
    this.loadData();
  }

  init() {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, this.foundationsService);
  }

  loadData() {
    this.beforeLoadingData();
    this.foundationsService.getFoundations({})
    .subscribe(
      (res) => {
        this.dataSource.data = this.dataSource.convertFoundationsToTreeNodes((res.foundations as Foundation[]));
        setTimeout(() => { this.afterLoadingData(); }, 50);

      },
      (err) => {
        this.afterLoadingData(err.error.message);
      }
    );
  }

  onNodeClick = (node: DynamicFlatNode) => this.nodeClick.emit(node.item);
  getLevel = (node: DynamicFlatNode) => node.level;
  isExpandable = (node: DynamicFlatNode) => node.expandable;
  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
}
